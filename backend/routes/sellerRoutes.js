import express from 'express';
import { protect, seller } from '../middleware/authMiddleware.js';
import { 
  getSellerProducts, 
  createSellerProduct, 
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  updateSellerProfile,
  getSellerDashboardStats
} from '../controllers/sellerController.js';

const router = express.Router();

router.route('/products')
  .get(protect, seller, getSellerProducts)
  .post(protect, seller, createSellerProduct);

router.route('/products/:id')
  .put(protect, seller, updateSellerProduct)
  .delete(protect, seller, deleteSellerProduct);

router.get('/orders', protect, seller, getSellerOrders);
router.put('/profile', protect, seller, updateSellerProfile);
router.get('/dashboard-stats', protect, seller, getSellerDashboardStats);

export default router;
