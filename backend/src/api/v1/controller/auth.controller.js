import jwt from "jsonwebtoken";
import Role from "../models/role.js";
import User from "../models/user.js";

export const signUpHandler = async(req, res ) =>{
    try{
        const {username, email , password , roles} = req.body;
        console.log(req.body);

        const newUser = new User({
            username,
            email,
            password
        });

        if (roles){
            const foundRoles = await Role.find({ name: { $in: roles } });
            newUser.roles = foundRoles.map((role) => role._id);
        }
        else{
            const role = await Role.findOne({ name: "user" });
            newUser.roles = [role._id];
        }

        const savedUser = await newUser.save();
        console.log(savedUser)   

        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
            expiresIn: 86400, // 24 hours
        });


        newUser.tokens = [{ token, signedAt: Date.now().toString() }]

        await newUser.save();

        return res.status(200).json({success: true, data: savedUser });
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message});
    }
}

// Sign in use email

export const signinHandler = async (req, res) => {
    try {
      // Request body email can be an email or username
      const userFound = await User.findOne({ email: req.body.email }).populate(
        "roles"
      );
  
      if (!userFound) return res.status(400).json({ message: "User Not Found" });
  
      const matchPassword = await User.comparePassword(
        req.body.password,
        userFound.password
      );
  
      if (!matchPassword)
        return res.status(401).json({
          success: false,
          token: null,
          message: "Invalid Password",
        });
        
      const token = jwt.sign({ id: userFound._id }, SECRET, {
        expiresIn: 86400, // 24 hours
      });
  
      let oldTokens = userFound.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter(t => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 86400) {
            return t;
          }
        });
      }
    
      await User.findByIdAndUpdate(userFound._id, {
        tokens: [ { token, signedAt: Date.now().toString() }]
      });
  
      res.json({ success: true, data: userFound, token });
    } catch (error) {
      console.log(error);
    }
  };


export const logoutHandler = async (req, res) => {
  if (req.headers && req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }
    try {
      const decoded = jwt.verify(token, SECRET);
      req.userId = decoded.id;
  
      const user = await User.findById(decoded.id, { password: 0 });
      if (!user) return res.status(404).json({ message: "No user found" });
      await User.findByIdAndUpdate(decoded.id, { tokens: [] });
      res.json({ success: true, message: 'Sign out successfully!' });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  }
};

