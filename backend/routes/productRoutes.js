import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin, sellerOrAdmin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

// Change admin to sellerOrAdmin for routes that sellers should access
router.route('/')
  .get(getProducts)
  .post(protect, sellerOrAdmin, createProduct);

router.get('/top', getTopProducts);

router.route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, sellerOrAdmin, checkObjectId, updateProduct)
  .delete(protect, sellerOrAdmin, checkObjectId, deleteProduct);

router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;
