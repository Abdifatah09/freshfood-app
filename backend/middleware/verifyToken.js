// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Replace with your actual secret key
    req.user = decoded;  // Add the decoded token data to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
