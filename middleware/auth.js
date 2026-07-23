const jwt = require("jsonwebtoken");


function requireAuth(req, res, next){
    const header = req.header.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if(!token){
        return res.status(401).json({message: "No Token Provided. Please Log in."});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch(e){
        return res.status(401).json({message:"Session expired or invalid"});
    }
}
module.exports = requireAuth;









