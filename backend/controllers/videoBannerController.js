import asyncHandler from '../middleware/asyncHandler.js';
import VideoBanner from '../models/videoBannerModel.js';
import path from 'path';
import fs from 'fs';

// @desc    Get all video banners
// @route   GET /api/videobanners
// @access  Private/Admin
const getVideoBanners = asyncHandler(async (req, res) => {
  const banners = await VideoBanner.find({}).sort({ createdAt: -1 });
  res.json(banners);
});

// @desc    Upload video banner
// @route   POST /api/videobanners
// @access  Private/Admin
const uploadVideoBanner = asyncHandler(async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    res.status(400);
    throw new Error('Video URL is required');
  }

  try {
    // Start a session for atomic operations
    const session = await VideoBanner.startSession();
    let createdBanner;

    await session.withTransaction(async () => {
      // First, set all existing banners to inactive
      await VideoBanner.updateMany(
        {},
        { isActive: false },
        { session }
      );

      // Create new banner as active
      const videoBanner = new VideoBanner({
        videoUrl,
        isActive: true
      });

      createdBanner = await videoBanner.save({ session });
    });

    await session.endSession();

    // Fetch all banners to return updated list
    const allBanners = await VideoBanner.find({})
      .sort({ createdAt: -1 });

    res.status(201).json({
      banner: createdBanner,
      allBanners,
      message: 'Video banner uploaded and activated successfully'
    });

  } catch (error) {
    res.status(500);
    throw new Error('Error uploading video banner: ' + error.message);
  }
});

// @desc    Delete video banner
// @route   DELETE /api/videobanners/:id
// @access  Private/Admin
const deleteVideoBanner = asyncHandler(async (req, res) => {
  const banner = await VideoBanner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Video banner not found');
  }

  try {
    // 1. Get the video filename from the URL
    const videoUrl = banner.videoUrl;
    const filename = videoUrl.split('/').pop(); // Gets the filename from the URL

    // 2. Construct the full path to the video file
    const videoPath = path.join(process.cwd(), 'uploads', 'videos', filename);

    // 3. Delete the physical file if it exists
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // 4. Delete the database entry
    await VideoBanner.deleteOne({ _id: banner._id });

    res.json({ 
      message: 'Video banner and file removed successfully',
      deletedBanner: banner
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error deleting video banner: ${error.message}`);
  }
});

// @desc    Update video banner status
// @route   PUT /api/videobanners/:id/status
// @access  Private/Admin
const updateVideoBannerStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  // First find the banner we want to update
  const banner = await VideoBanner.findById(req.params.id);
  
  if (!banner) {
    res.status(404);
    throw new Error('Video banner not found');
  }

  try {
    const session = await VideoBanner.startSession();
    
    await session.withTransaction(async () => {
      // If activating a banner, ensure only one is active
      if (isActive) {
        await VideoBanner.updateMany(
          {},  // Update all documents
          { isActive: false },
          { session }
        );
        
        banner.isActive = true;
      } else {
        // If deactivating, just update this banner
        banner.isActive = false;
      }
      
      await banner.save({ session });
    });

    await session.endSession();

    // Get fresh list of all banners
    const updatedBanners = await VideoBanner.find({})
      .sort({ createdAt: -1 });
    
    res.json({
      updatedBanner: banner,
      allBanners: updatedBanners,
      message: `Banner ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    res.status(500);
    throw new Error('Error updating banner status: ' + error.message);
  }
});

// @desc    Get active video banner
// @route   GET /api/videobanners/active
// @access  Public
const getActiveVideoBanner = asyncHandler(async (req, res) => {
  const banner = await VideoBanner.findOne({ isActive: true })
    .sort({ createdAt: -1 })
    .select('videoUrl isActive')
    .lean();

  if (!banner) {
    return res.status(404).json({ message: 'No active banner found' });
  }

  res.set({
    'Cache-Control': 'public, max-age=30',
    'Vary': 'Accept-Encoding'
  });

  res.json(banner);
});

export {
  getVideoBanners,
  uploadVideoBanner,
  deleteVideoBanner,
  updateVideoBannerStatus,
  getActiveVideoBanner,
};
