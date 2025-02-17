import path from 'path';
import express from 'express';
import multer from 'multer';

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

export default router;
