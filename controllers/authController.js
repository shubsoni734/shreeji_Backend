const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModules");
const jwt = require("jsonwebtoken");
const { route, post } = require("../routes/authRoute");
const { model } = require("mongoose");
const { send } = require("process");
const { log } = require("console");
const requireSignin = require("../middlewares/authMiddleware");
const { checkPrime } = require("crypto");
const orderModel = require("../models/orderModel");
const rateModel = require("../models/rateModel");
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

//update prfole
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

//All orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params;
    const status = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId.oid, status, {
      new: true,
    });
    res.status(200).send({
      orders,
    });
    // res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const insertRate = async (req, res) => {
  try {
    const { silver, gold } = req.body;
    if (!silver && !gold) {
      return res.send({ message: "field is require is required" });
    }
    const rate = new rateModel({ silver, gold }).save();
    console.log(rate);
    res.status(200).send({
      success: true,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const getrate = async (req, res) => {
  try {
    const rate = await rateModel.findOne({}).sort({ createdAt: -1 }).exec();

    res.status(200).send({
      rate,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while fetching rate",
      error,
    });
  }
};

module.exports.registerController = registerController;
module.exports.loginController = loginController;
module.exports.testController = testController;
module.exports.forgotPasswordController = forgotPasswordController;
module.exports.updateProfileController = updateProfileController;
module.exports.getOrdersController = getOrdersController;
module.exports.getAllOrdersController = getAllOrdersController;
module.exports.orderStatusController = orderStatusController;
module.exports.insertRate = insertRate;
module.exports.getrate = getrate;
