const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  userAuth,
} = require("../controllers/authController");
const { request } = require("http");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
// create router object
const route = express.Router();
// routing
//Register || Method post
route.post("/register", registerController);

// Login || method Post

route.post("/login", loginController);

route.post("/forgot-password", forgotPasswordController);

route.get("/test", requireSignIn, isAdmin, testController);

// protected user route auth

route.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// protected admin route auth

route.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = route;
