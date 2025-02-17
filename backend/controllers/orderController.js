import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Get items from DB and verify prices
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = await Promise.all(
    orderItems.map(async (itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      const product = await Product.findById(itemFromClient._id);
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        seller: product.seller, // Add seller reference from product
        _id: undefined,
      };
    })
  );

  // Calculate prices
  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    // Initialize payment fields
    isPaid: false,
    paidAt: null,
    paymentResult: null
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log('Received payment update request:', req.body);
  
  try {
    // First verify the payment
    const { verified, value } = await verifyPayPalPayment(req.body.id);
    console.log('Payment verification result:', { verified, value });

    if (!verified) {
      res.status(400);
      throw new Error('Payment verification failed');
    }

    // Direct MongoDB update
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          isPaid: true,
          paidAt: new Date().toISOString(),
          paymentResult: {
            id: req.body.id,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: req.body.payer?.email_address || '',
          },
        },
      },
      { 
        new: true,
        runValidators: true,
      }
    );

    console.log('Updated order document:', updatedOrder);

    if (!updatedOrder) {
      throw new Error('Order update failed');
    }

    // Verify the update was successful
    const verifiedOrder = await Order.findById(req.params.id);
    console.log('Verification of updated order:', verifiedOrder);

    res.json(updatedOrder);

  } catch (error) {
    console.error('Payment update error:', error);
    res.status(400);
    throw error;
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Seller or Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if user is seller of any items in order or is admin
    const isSellerOfOrder = order.orderItems.some(
      item => item.seller.toString() === req.user._id.toString()
    );

    if (!req.user.isAdmin && !isSellerOfOrder) {
      res.status(403);
      throw new Error('Not authorized to mark this order as delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
