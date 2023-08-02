const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProdductController,
  getProductsController,
  getSingleProductController,
  getPhotoController,
  deleteProductController,
  updateProductController,
  filterProductController,
  searchProductController,
  productCountController,
  productListController,
  productFiltersController,
  similarProductsController,
  productCategoryController,
  brainTreeTokenController,
  brainTreePaymentController,
} = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

//create product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProdductController
);

//get product route
router.get("/get-product", getProductsController);

//get single product route
router.get("/getSingle-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", getPhotoController);

// dlelete product
router.delete("/delete-product/:pid", deleteProductController);
//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//filter product
router.post("/product-filters", productFiltersController);

// total coiunt of Product
router.get("/getTotal", productCountController);

//get Product List
// router.get("/product-list/:");

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/related-product/:cid/:pid", similarProductsController);

//category wise product routes
router.get("/product-category/:slug", productCategoryController);

//payment Routes
//token
router.get("/braintree/token", brainTreeTokenController);

// payment
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

module.exports = router;
