const jwt = require('jsonwebtoken');

const jsonwebtoken = (req, res, next) =>{
  const token = jwt.headers.authorization.split(' ')[1];

  //Extract the jwt token from the request headers
  if(!token){
    return res.status(401).json({error: 'Unauthorization'});
  }

  try{
    //verify the jwt token
    const encoded = jwt.verify(token, process.env.JWT_SECRET);

    //Attach user information to the request object
    req.user = encoded
    next();
  }
  catch(error){
    console.error(error);
    res.status(401).json({error: 'Invalid Token'});
  }
}


//create jwt token
const generateToken = (userData)=>{
  return jwt.sign(userData, process.env.JWT_SECRET);
}


module.exports = {jsonwebtoken, generateToken};