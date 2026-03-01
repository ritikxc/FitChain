// Central error handler — catches all errors thrown in routes

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const messages = Object.values(err.errors).map((e) => e.message)
    message = messages.join('. ')
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `An account with this ${field} already exists.`
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${statusCode}] ${message}`)
    if (statusCode === 500) console.error(err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  })
}

// Helper to create errors with status codes
const createError = (message, statusCode = 400) => {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, createError }
