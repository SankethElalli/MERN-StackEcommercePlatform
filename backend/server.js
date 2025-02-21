import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import videoBannerRoutes from './routes/videoBannerRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5001;

connectDB();

const app = express();

const __dirname = path.resolve();

// Optimized video streaming route
app.get('/uploads/videos/:filename', (req, res) => {
  const videoPath = path.join(__dirname, 'uploads/videos', req.params.filename);
  
  if (!fs.existsSync(videoPath)) {
    console.error('Video not found:', videoPath);
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Add caching headers
  res.set({
    'Cache-Control': 'public, max-age=31536000',
    'Accept-Ranges': 'bytes',
    'Content-Type': 'video/mp4',
  });

  if (range) {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, fileSize - 1);

    const contentLength = end - start + 1;
    const stream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': contentLength,
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error streaming video');
      }
    });

    stream.pipe(res);
  } else {
    // Send entire file if no range is requested
    res.writeHead(200, {
      'Content-Length': fileSize
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Serve static files with absolute paths
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create required directories if they don't exist
[
  'uploads',
  'uploads/products',
  'uploads/logos',
  'uploads/videos'
].forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

app.use('/api/upload', uploadRoutes);  // Make sure this is before other routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/videobanners', videoBannerRoutes);  // Add this line

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
