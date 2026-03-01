const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes — verifies JWT and attaches user to req
const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' })
      }
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }

    // 3. Check user still exists in DB
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' })
    }

    // 4. Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ success: false, message: 'Server error during authentication.' })
  }
}

// Helper to sign a JWT token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

module.exports = { protect, signToken }
