import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, value, path } = req.body;

  // Check if category with this value already exists
  const categoryExists = await Category.findOne({ value });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this value already exists');
  }

  const category = await Category.create({
    name,
    value,
    path,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, value, path } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    // If value is changing, check if the new value already exists in another category
    if (value !== category.value) {
      const existingCategory = await Category.findOne({ value });
      if (existingCategory) {
        res.status(400);
        throw new Error('Category with this value already exists');
      }
    }

    category.name = name || category.name;
    category.value = value || category.value;
    category.path = path || category.path;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Check if any products are using this category
    const productsUsingCategory = await Product.find({ 
      category: { $regex: new RegExp(category.value, 'i') } 
    });

    if (productsUsingCategory.length > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete this category. ${productsUsingCategory.length} products are using it.`
      );
    }

    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
