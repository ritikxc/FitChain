const express = require('express')
const { body, validationResult } = require('express-validator')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const { protect, signToken } = require('../middleware/auth')
const { createError } = require('../middleware/errorHandler')

const router = express.Router()

// Rate limit auth endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// -----------------------------------------------
// POST /api/auth/signup
// -----------------------------------------------
router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const { name, email, password } = req.body

      // Check if email already taken
      const existing = await User.findOne({ email })
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
      }

      // Create user (password gets hashed in pre-save hook)
      const user = await User.create({ name, email, password })

      // Sign JWT
      const token = signToken(user._id)

      res.status(201).json({
        success: true,
        token,
        user: user.toSafeObject(),
      })
    } catch (err) {
      next(err)
    }
  }
)

// -----------------------------------------------
// POST /api/auth/login
// -----------------------------------------------
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const { email, password } = req.body

      // Find user and explicitly include password field (it's excluded by default)
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      // Compare password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      const token = signToken(user._id)

      res.json({
        success: true,
        token,
        user: user.toSafeObject(),
      })
    } catch (err) {
      next(err)
    }
  }
)

// -----------------------------------------------
// GET /api/auth/me  — get current user from token
// -----------------------------------------------
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() })
})

// -----------------------------------------------
// PATCH /api/auth/profile  — update goal/location/calorieGoal
// -----------------------------------------------
router.patch(
  '/profile',
  protect,
  [
    body('goal').optional().isIn(['hypertrophy', 'strength', 'endurance']).withMessage('Invalid goal'),
    body('location').optional().isIn(['home', 'gym']).withMessage('Invalid location'),
    body('calorieGoal').optional().isInt({ min: 500, max: 10000 }).withMessage('Calorie goal must be between 500–10000'),
    body('profileCompleted').optional().isBoolean().withMessage('Profile completion must be true or false'),
    body('setupComplete').optional().isBoolean().withMessage('Setup completion must be true or false'),
    body('fitnessGoal').optional().isIn(['weight_loss', 'maintain', 'weight_gain', 'muscle_gain']).withMessage('Invalid fitness goal'),
    body('activityLevel').optional().isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active']).withMessage('Invalid activity level'),
    body('workoutSplit').optional().isString().withMessage('Invalid split'),
    body('unitSystem').optional().isIn(['metric', 'imperial']).withMessage('Invalid unit system'),
    body('darkMode').optional().isBoolean().withMessage('Dark mode must be true or false'),
    body('weight').optional().isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300kg'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const {
        goal,
        location,
        calorieGoal,
        height,
        weight,
        age,
        gender,
        fitnessGoal,
        proteinGoal,
        carbsGoal,
        fatGoal,
        waterGoal,
        activityLevel,
        setupComplete,
        profileCompleted,
        workoutSplit,
        unitSystem,
        darkMode,
      } = req.body

      const update = {}

      if (goal !== undefined) update['profile.goal'] = goal
      if (location !== undefined) update['profile.location'] = location
      if (calorieGoal !== undefined) update['profile.calorieGoal'] = calorieGoal
      if (height !== undefined) update['profile.height'] = height
      if (weight !== undefined) update['profile.weight'] = weight
      if (age !== undefined) update['profile.age'] = age
      if (gender !== undefined) update['profile.gender'] = gender
      if (fitnessGoal !== undefined) update['profile.fitnessGoal'] = fitnessGoal
      if (proteinGoal !== undefined) update['profile.proteinGoal'] = proteinGoal
      if (carbsGoal !== undefined) update['profile.carbsGoal'] = carbsGoal
      if (fatGoal !== undefined) update['profile.fatGoal'] = fatGoal
      if (waterGoal !== undefined) update['profile.waterGoal'] = waterGoal
      if (activityLevel !== undefined) update['profile.activityLevel'] = activityLevel
      if (workoutSplit !== undefined) update['profile.workoutSplit'] = workoutSplit
      if (unitSystem !== undefined) update['profile.unitSystem'] = unitSystem
      if (darkMode !== undefined) update['profile.darkMode'] = darkMode

      const completedValue = profileCompleted ?? setupComplete
      if (completedValue !== undefined) {
        update['profile.profileCompleted'] = completedValue
        update['profile.setupComplete'] = completedValue
      }

      // If weight was provided, also record entry in weightHistory
      const mongoUpdate = { $set: update }
      if (weight !== undefined) {
        const todayStr = new Date().toISOString().split('T')[0]
        mongoUpdate.$push = {
          'profile.weightHistory': {
            date: todayStr,
            weight: Number(weight),
          },
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        mongoUpdate,
        { new: true, runValidators: true }
      )

      res.json({ success: true, user: user.toSafeObject() })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
