const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModules");
const jwt = require("jsonwebtoken");
const { route, post } = require("../routes/authRoute");
const { model } = require("mongoose");
const { send } = require("process");
const { log } = require("console");
const requireSignin = require("../middlewares/authMiddleware");
const { checkPrime } = require("crypto");

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;
    // validation
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "emails is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!phone) {
      return res.send({ message: "phone munber is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    //   check user is availabe or not
    const existingUser = await userModel.findOne({ email });
    //   check existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "user already register",
      });
    }

    //   register user
    //   convert password in hash format
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();
    // user.name = name;
    // user.email = email;
    // user.password = hashedPassword;
    // user.phone = phone;
    // user.address = address;
    // await user.save();

    console.log(user);

    res.status(201).send({
      success: true,
      message: "User register Succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

// Login Route
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email and Password",
      });
    }
    //   check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email Not Register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invlid Password",
      });
    }

    //   create Token

    const token = await jwt.sign({ _id: user._id }, process.env.jwt_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        answer: user.answer,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      susccess: false,
      message: "Error in login",
      error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something want Wrong",
      error,
    });
  }
};

const testController = async (req, res) => {
  res.send("test is process");
};

module.exports.registerController = registerController;
module.exports.loginController = loginController;
module.exports.testController = testController;
module.exports.forgotPasswordController = forgotPasswordController;
