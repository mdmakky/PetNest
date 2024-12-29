const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const generateToken = (user) => {
  const payload = { id: user._id };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = generateToken;
