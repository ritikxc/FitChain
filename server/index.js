require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorHandler')

// --- Connect to MongoDB ---
connectDB()

const app = express()

// --- Global Middleware ---

// CORS — allow requests from the React dev server
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }))

// HTTP request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Global rate limit (generous — auth routes have their own stricter limit)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
})
app.use('/api', globalLimiter)

// --- Routes ---
app.use('/api/auth', require('./routes/auth'))
app.use('/api/meals', require('./routes/meals'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FitChain API is running 🏋️',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
})

// --- Central Error Handler (must be last) ---
app.use(errorHandler)

// --- Start Server ---
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 FitChain server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
