import path from 'path';
import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

// Separate storage configurations for products and logos
const productStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename(req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const logoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/logos/');
  },
  filename(req, file, cb) {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Optimized video storage configuration
const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Get the file extension
    const ext = path.extname(file.originalname);
    // Create filename with timestamp and proper extension
    const filename = `video-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Check file type helper
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

function checkVideoType(file, cb) {
  const filetypes = /mp4|webm|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Videos only!');
  }
}

// Setup multer for products
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Setup multer for logos
const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Increased to 100MB
    files: 1
  },
  fileFilter: function(req, file, cb) {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only MP4, MOV and WebM are allowed.'), false);
    }
    cb(null, true);
  }
}).single('video');

// Product image upload route
router.post('/product', uploadProduct.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'Product image uploaded',
      image: `/uploads/products/${req.file.filename}`,
    });
  } else {
    res.status(400).json({ message: 'No image file provided' });
  }
});

// Logo upload route
router.post('/logo', uploadLogo.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'Logo uploaded',
      image: `/uploads/logos/${req.file.filename}`,
    });
  } else {
    res.status(400).json({ message: 'No image file provided' });
  }
});

// Optimized video upload route
router.post('/video', protect, admin, (req, res) => {
  uploadVideo(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 100MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Success response with video details
    res.json({
      message: 'Video uploaded successfully',
      videoUrl: `/uploads/videos/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

export default router;
