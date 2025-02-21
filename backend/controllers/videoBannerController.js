import asyncHandler from '../middleware/asyncHandler.js';
import VideoBanner from '../models/videoBannerModel.js';

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

  const videoBanner = new VideoBanner({
    videoUrl,
    isActive: true
  });

  const createdBanner = await videoBanner.save();
  res.status(201).json(createdBanner);
});

// @desc    Delete video banner
// @route   DELETE /api/videobanners/:id
// @access  Private/Admin
const deleteVideoBanner = asyncHandler(async (req, res) => {
  const banner = await VideoBanner.findById(req.params.id);

  if (banner) {
    await VideoBanner.deleteOne({ _id: banner._id });
    res.json({ message: 'Video banner removed' });
  } else {
    res.status(404);
    throw new Error('Video banner not found');
  }
});

// @desc    Update video banner status
// @route   PUT /api/videobanners/:id/status
// @access  Private/Admin
const updateVideoBannerStatus = asyncHandler(async (req, res) => {
  const banner = await VideoBanner.findById(req.params.id);

  if (banner) {
    // If setting a banner to active, deactivate all other banners first
    if (req.body.isActive) {
      await VideoBanner.updateMany(
        { _id: { $ne: banner._id } },
        { isActive: false }
      );
    }

    banner.isActive = req.body.isActive;
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Video banner not found');
  }
});

// @desc    Get active video banner
// @route   GET /api/videobanners/active
// @access  Public
const getActiveVideoBanner = asyncHandler(async (req, res) => {
  const banner = await VideoBanner.findOne({ isActive: true })
    .sort({ createdAt: -1 })
    .select('videoUrl')
    .lean();

  if (!banner) {
    return res.json(null); // Return null if no active banner
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
