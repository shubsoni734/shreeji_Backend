const JWT = require("jsonwebtoken");
const userModules = require("../models/userModules");

const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModules.findById(req.user._id);
    console.log(user.role);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      success: false,
      message: "Error in admin Middle Ware",
    });
  }
};
module.exports.requireSignIn = requireSignIn;
module.exports.isAdmin = isAdmin;
