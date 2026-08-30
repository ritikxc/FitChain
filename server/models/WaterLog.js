const mongoose = require('mongoose')

const waterLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
)

waterLogSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('WaterLog', waterLogSchema)
