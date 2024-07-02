import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Role from "../models/role.js";


export const veriFyToken  = async(req, res, next)=>{
    let token = req.header["x-access-token"];

    if(!token){
        return res.status(403).json({message: "No token provided"});
    }

    try{
        const decoded = jwt.verify(token,process.env.SECRET);
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0});
        
        let orgToken = user.tokens.filter(t =>  t.token === token);
        if(orgToken.lenght == 0){
            return res.status(401).json({message : "Token is died"});
        }
        if (!user) return res.status(404).json({ message: "No user found" });

    }catch(err){
        return res.status(401).json({message: "Unauthorized!"});
    }
}


export const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      const roles = await Role.find({ _id: { $in: user.roles } });
  
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
  
      return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  };