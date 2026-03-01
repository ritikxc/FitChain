const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for fast queries by user
    },
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      maxlength: [100, 'Meal name cannot exceed 100 characters'],
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
      max: [10000, 'Calories seem too high'],
    },
    protein: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000,
    },
    carbs: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000,
    },
    fats: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000,
    },
    // Store date as YYYY-MM-DD string for easy daily grouping
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient "meals for user on date" queries
mealSchema.index({ user: 1, date: 1 })

module.exports = mongoose.model('Meal', mealSchema)
