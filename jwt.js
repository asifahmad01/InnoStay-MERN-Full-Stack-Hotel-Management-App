const jwt = require('jsonwebtoken');

const jsonwebtoken = (req, res, next) => {
  // First, check if the request header has an authorization token
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: 'Token not found' });
  }

  // Extract the JWT token from the authorization header
  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Token' });
  }
};


//create jwt token
const generateToken = (userData)=>{
  return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}


module.exports = { jwtAutMiddleware: jsonwebtoken, generateToken };
