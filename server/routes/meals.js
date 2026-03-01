const express = require('express')
const { body, param, query, validationResult } = require('express-validator')
const Meal = require('../models/Meal')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All meal routes require authentication
router.use(protect)

// -----------------------------------------------
// GET /api/meals?date=YYYY-MM-DD
// Get all meals for the authenticated user on a given date
// -----------------------------------------------
router.get(
  '/',
  [
    query('date')
      .notEmpty().withMessage('Date is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const meals = await Meal.find({
        user: req.user._id,
        date: req.query.date,
      }).sort({ createdAt: 1 }) // Oldest first

      res.json({ success: true, meals })
    } catch (err) {
      next(err)
    }
  }
)

// -----------------------------------------------
// GET /api/meals/weekly
// Get meal aggregates for the past 7 days (for charts)
// -----------------------------------------------
router.get('/weekly', async (req, res, next) => {
  try {
    // Build array of last 7 day strings
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }

    // Aggregate meals per day
    const results = await Meal.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $in: days },
        },
      },
      {
        $group: {
          _id: '$date',
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          carbs: { $sum: '$carbs' },
          fats: { $sum: '$fats' },
        },
      },
    ])

    // Map results by date, fill missing days with zeros
    const byDate = {}
    results.forEach((r) => { byDate[r._id] = r })

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const weekly = days.map((dateStr) => {
      const dayOfWeek = dayLabels[new Date(dateStr + 'T12:00:00').getDay()]
      const data = byDate[dateStr]
      return {
        day: dayOfWeek,
        date: dateStr,
        calories: data?.calories || 0,
        protein: data?.protein || 0,
        carbs: data?.carbs || 0,
        fats: data?.fats || 0,
      }
    })

    res.json({ success: true, weekly })
  } catch (err) {
    next(err)
  }
})

// -----------------------------------------------
// POST /api/meals
// Add a new meal
// -----------------------------------------------
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Meal name is required').isLength({ max: 100 }),
    body('calories').isFloat({ min: 0, max: 10000 }).withMessage('Enter valid calories (0–10000)'),
    body('protein').optional().isFloat({ min: 0 }).default(0),
    body('carbs').optional().isFloat({ min: 0 }).default(0),
    body('fats').optional().isFloat({ min: 0 }).default(0),
    body('date')
      .notEmpty().withMessage('Date is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const { name, calories, protein, carbs, fats, date } = req.body

      const meal = await Meal.create({
        user: req.user._id,
        name,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        date,
      })

      res.status(201).json({ success: true, meal })
    } catch (err) {
      next(err)
    }
  }
)

// -----------------------------------------------
// DELETE /api/meals/:id
// Delete a meal (only owner can delete)
// -----------------------------------------------
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid meal ID')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const meal = await Meal.findById(req.params.id)

      if (!meal) {
        return res.status(404).json({ success: false, message: 'Meal not found.' })
      }

      // Ensure the meal belongs to the requesting user
      if (meal.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this meal.' })
      }

      await meal.deleteOne()

      res.json({ success: true, message: 'Meal deleted.' })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
