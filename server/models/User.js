const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    profile: {
      goal: {
        type: String,
        enum: ['hypertrophy', 'strength', 'endurance'],
        default: 'hypertrophy',
      },
      location: {
        type: String,
        enum: ['home', 'gym'],
        default: 'gym',
      },
      calorieGoal: {
        type: Number,
        default: 2200,
        min: 500,
        max: 10000,
      },
      height: {
        type: Number,
        default: 175,
        min: 50,
        max: 260,
      },
      weight: {
        type: Number,
        default: 72,
        min: 30,
        max: 300,
      },
      age: {
        type: Number,
        default: 28,
        min: 13,
        max: 120,
      },
      gender: {
        type: String,
        default: '',
      },
      fitnessGoal: {
        type: String,
        enum: ['weight_loss', 'maintain', 'weight_gain', 'muscle_gain'],
        default: 'weight_loss',
      },
      proteinGoal: {
        type: Number,
        default: 160,
        min: 0,
        max: 500,
      },
      carbsGoal: {
        type: Number,
        default: 220,
        min: 0,
        max: 1000,
      },
      fatGoal: {
        type: Number,
        default: 70,
        min: 0,
        max: 400,
      },
      waterGoal: {
        type: Number,
        default: 3,
        min: 0,
        max: 20,
      },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
        default: 'lightly_active',
      },
      setupComplete: {
        type: Boolean,
        default: false,
      },
      profileCompleted: {
        type: Boolean,
        default: false,
      },
      workoutSplit: {
        type: String,
        default: 'ppl',
      },
      unitSystem: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric',
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
      weightHistory: [
        {
          date: { type: String, required: true },
          weight: { type: Number, required: true },
        },
      ],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Return safe user object (no password)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profile: this.profile,
    createdAt: this.createdAt,
  }
}

module.exports = mongoose.model('User', userSchema)
