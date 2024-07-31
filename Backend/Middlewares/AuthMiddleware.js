const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtAuthMiddleWare=(req,res,next)=>{
    
   const authorization = req.headers.authorization; 
   if (!authorization) return res.status(404).json({ error: "Token not found" })

      const token = authorization.split(' ')[1];
     if(!token) return res.status(400).json({error:"unauthorized"});
// taking user id from token
   //   const userId = getUserIdFromToken(req.headers.authorization); // Your logic to get user ID
   //   if (userId) {
   //       req.params.id = userId;
   //       next();
   //   }

     try{
        const decoded= jwt.verify(token, process.env.SECRET_KEY);

        // attach user information the the request object 
        req.user=decoded;
        next();
     }
    
     catch(error){
        console.error(error);
        res.status(401).json({error:"invalid token"});
     }

}

// function to generate token 
const generateToken=(userdata)=>{
   const expiresIn = '1h';
   return jwt.sign({ userdata }, process.env.SECRET_KEY, { expiresIn });
}

module.exports= {jwtAuthMiddleWare, generateToken};