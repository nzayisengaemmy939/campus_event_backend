// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401); // No token
  
    console.log("Token received:", token); // Debugging
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
  
      console.log("Decoded user:", user); // Debugging
      
      req.user = user; // Attach user to request object
      next();
    });
  };
  export default authenticateToken
  