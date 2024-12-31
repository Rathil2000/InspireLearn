const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Get token

  if (!token) return res.status(403).json({ message: 'Token missing or invalid' });

  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;  // Attach user data to the request
    console.log(user,1221)
    next();  // Proceed with the request
  });
};
module.exports = authenticateToken;
