const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = { authLimiter };
