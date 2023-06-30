const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  singleCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryControllers");

const router = express.Router();
//Routes

//Create catogery routes
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update catogery route
router.put(
  "/update-category/category_id=:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// get category route
router.get("/categories", getCategoryController);
// get single category
router.get("/singleCategory/:slug", singleCategoryController);
//delete category route
router.delete(
  "/deleteCategory/category_id=:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
module.exports = router;
