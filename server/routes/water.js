const express = require('express')
const { body, query, validationResult } = require('express-validator')
const WaterLog = require('../models/WaterLog')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

// GET /api/water?date=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]
    const log = await WaterLog.findOne({
      user: req.user._id,
      date,
    })

    res.json({ success: true, amount: log?.amount || 0 })
  } catch (err) {
    next(err)
  }
})

// GET /api/water/monthly
router.get('/monthly', async (req, res, next) => {
  try {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }

    const logs = await WaterLog.find({
      user: req.user._id,
      date: { $in: days },
    })

    const byDate = {}
    logs.forEach((l) => { byDate[l.date] = l.amount })

    const monthly = days.map((dateStr) => ({
      date: dateStr,
      amount: byDate[dateStr] || 0,
    }))

    res.json({ success: true, monthly })
  } catch (err) {
    next(err)
  }
})

// POST /api/water - Set or increment water intake
router.post(
  '/',
  [
    body('amount').isFloat({ min: 0, max: 50 }).withMessage('Water amount must be between 0 and 50L'),
    body('date').notEmpty().withMessage('Date is required').matches(/^\d{4}-\d{2}-\d{2}$/),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg })
      }

      const { amount, date } = req.body

      const log = await WaterLog.findOneAndUpdate(
        { user: req.user._id, date },
        { $set: { amount: Number(amount) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      res.json({ success: true, amount: log.amount })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
