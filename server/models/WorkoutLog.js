const mongoose = require('mongoose')

const workoutExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: String, default: '10' },
  weight: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
})

const workoutLogSchema = new mongoose.Schema(
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
    dayTitle: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      enum: ['hypertrophy', 'strength', 'endurance'],
      default: 'hypertrophy',
    },
    split: {
      type: String,
      default: 'ppl',
    },
    exercises: [workoutExerciseSchema],
    totalVolume: {
      type: Number,
      default: 0,
    },
    completedExercises: {
      type: Number,
      default: 0,
    },
    totalExercises: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

workoutLogSchema.index({ user: 1, date: 1 })

module.exports = mongoose.model('WorkoutLog', workoutLogSchema)
