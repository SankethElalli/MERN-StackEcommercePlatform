import express from 'express';
import {
  getVideoBanners,
  uploadVideoBanner,
  deleteVideoBanner,
  updateVideoBannerStatus,
  getActiveVideoBanner,
} from '../controllers/videoBannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getVideoBanners)
  .post(protect, admin, uploadVideoBanner);

router.get('/active', getActiveVideoBanner);

router.route('/:id')
  .delete(protect, admin, deleteVideoBanner);

router.route('/:id/status')
  .put(protect, admin, updateVideoBannerStatus);

export default router;
