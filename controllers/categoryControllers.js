const { default: slugify } = require("slugify");
const categoryModel = require("../models/categoryModel");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//update category
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    let { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      category,
      message: `Category Updated Successfully`,
    });
    console.log("category id:", id);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating Category ",
      error,
    });
  }
};

//get category
const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category List ",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while gating all Category ",
      error,
    });
  }
};

//single category
const singleCategoryController = async (req, res) => {
  try {
    let slug = req.params.slug;
    const category = await categoryModel.findOne({ slug });
    res.status(200).send({
      success: true,
      message: "Get Single Catogery Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Gating Single Category",
      error,
    });
  }
};

//delete catrgory
const deleteCategoryController = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id, "fgdsggf");
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Catogery Deleted Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in deleting Category",
      error,
    });
  }
};

module.exports.createCategoryController = createCategoryController;
module.exports.updateCategoryController = updateCategoryController;
module.exports.getCategoryController = getCategoryController;
module.exports.deleteCategoryController = deleteCategoryController;
module.exports.singleCategoryController = singleCategoryController;
