const express = require('express')
const { body, query, validationResult } = require('express-validator')
const WorkoutLog = require('../models/WorkoutLog')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

// GET /api/workouts/today?date=YYYY-MM-DD
router.get('/today', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]
    const workout = await WorkoutLog.findOne({
      user: req.user._id,
      date,
    })

    res.json({ success: true, workout: workout || null })
  } catch (err) {
    next(err)
  }
})

// GET /api/workouts/history
router.get('/history', async (req, res, next) => {
  try {
    const workouts = await WorkoutLog.find({
      user: req.user._id,
    })
      .sort({ date: -1 })
      .limit(30)

    res.json({ success: true, workouts })
  } catch (err) {
    next(err)
  }
})

// GET /api/workouts/monthly
router.get('/monthly', async (req, res, next) => {
  try {
    // Generate dates for the past 30 days
    const days = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }

    const workouts = await WorkoutLog.find({
      user: req.user._id,
      date: { $in: days },
    }).sort({ date: 1 })

    res.json({ success: true, workouts, days })
  } catch (err) {
    next(err)
  }
})

// POST /api/workouts - Log or update workout session
router.post(
  '/',
  [
    body('date').notEmpty().withMessage('Date is required').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('dayTitle').notEmpty().withMessage('Day title is required'),
    body('exercises').isArray().withMessage('Exercises must be an array'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const { date, dayTitle, goal, split, exercises, isCompleted } = req.body

      let totalVolume = 0
      let completedExercises = 0

      exercises.forEach((ex) => {
        const sets = Number(ex.sets) || 0
        const repMatch = String(ex.reps).match(/\d+/)
        const reps = repMatch ? Number(repMatch[0]) : 10
        const weight = Number(ex.weight) || 0

        totalVolume += sets * reps * weight
        if (ex.completed) completedExercises += 1
      })

      const workout = await WorkoutLog.findOneAndUpdate(
        { user: req.user._id, date },
        {
          $set: {
            dayTitle,
            goal: goal || 'hypertrophy',
            split: split || 'ppl',
            exercises,
            totalVolume,
            completedExercises,
            totalExercises: exercises.length,
            isCompleted: isCompleted !== undefined ? isCompleted : completedExercises === exercises.length,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      res.status(200).json({ success: true, workout })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
