const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js")

const protect = async (req, res, next) => {
  let token;
  try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }


module.exports=protect
