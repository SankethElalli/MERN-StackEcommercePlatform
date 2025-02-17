import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { deleteFile } from '../utils/fileHelper.js';

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// @desc    Create a seller product
// @route   POST /api/seller/products
// @access  Private/Seller
const createSellerProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      seller: req.user._id,
      image: req.body.image || '/images/sample.jpg', // Use uploaded image
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400);
    throw new Error('Error creating product');
  }
});

// @desc    Update a seller product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateSellerProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a seller product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteSellerProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
  // Find orders where any order item has this seller
  const orders = await Order.find({
    'orderItems.seller': req.user._id
  }).populate('user', 'id name email');

  // Filter order items to only show items belonging to this seller
  const processedOrders = orders.map(order => {
    const sellerItems = order.orderItems.filter(
      item => item.seller.toString() === req.user._id.toString()
    );
    
    // Calculate seller's portion of the order
    const sellerTotal = sellerItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    return {
      _id: order._id,
      user: order.user,
      orderItems: sellerItems,
      createdAt: order.createdAt,
      totalPrice: sellerTotal,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt
    };
  });

  res.json(processedOrders);
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.seller) {
      user.seller = {};
      user.isSeller = true; // Ensure isSeller flag is set
    }

    // Delete old logo if it exists and a new one is being set
    if (req.body.sellerLogo && user.seller.logo && user.seller.logo !== req.body.sellerLogo) {
      deleteFile(user.seller.logo);
    }
    
    user.seller.name = req.body.sellerName || user.seller.name;
    user.seller.logo = req.body.sellerLogo || user.seller.logo;
    user.seller.description = req.body.sellerDescription || user.seller.description;

    const updatedUser = await user.save();

    // Return the updated seller info
    res.json({
      _id: updatedUser._id,
      seller: {
        name: updatedUser.seller.name,
        logo: updatedUser.seller.logo,
        description: updatedUser.seller.description
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
const getSellerDashboardStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'orderItems.seller': req.user._id,
    isPaid: true
  });

  // Calculate total sales for this seller only
  const totalSales = orders.reduce((total, order) => {
    const sellerItems = order.orderItems.filter(
      item => item.seller.toString() === req.user._id.toString()
    );
    return total + sellerItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, 0);

  // Get recent orders (last 5)
  const recentOrders = await Order.find({ 'orderItems.seller': req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'id name');

  // Get product stats
  const products = await Product.find({ seller: req.user._id });
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.countInStock === 0).length;
  const lowStock = products.filter(p => p.countInStock <= 5 && p.countInStock > 0).length;

  // Get monthly sales for chart
  const monthlyOrders = await Order.aggregate([
    {
      $match: {
        'orderItems.seller': req.user._id,
        isPaid: true
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$paidAt' },
          year: { $year: '$paidAt' }
        },
        total: { $sum: '$totalPrice' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 }
  ]);

  res.json({
    totalSales,
    recentOrders,
    productStats: {
      total: totalProducts,
      outOfStock,
      lowStock
    },
    monthlyOrders
  });
});

export {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  updateSellerProfile,
  getSellerDashboardStats,
};
