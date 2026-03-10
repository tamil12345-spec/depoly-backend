// backend/middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies JWT from Authorization header or cookie.
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User no longer exists.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};


// backend/middleware/errorHandler.js
/**
 * Global Express error handler.
 */
exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Server Error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `An account with this ${field} already exists.`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message    = Object.values(err.errors).map((e) => e.message).join('. ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { message = 'Invalid token.';         statusCode = 401; }
  if (err.name === 'TokenExpiredError')  { message = 'Token has expired.';     statusCode = 401; }

  res.status(statusCode).json({ success: false, error: message });
};
