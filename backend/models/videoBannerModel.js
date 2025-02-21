import mongoose from 'mongoose';

const videoBannerSchema = mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const VideoBanner = mongoose.model('VideoBanner', videoBannerSchema);
export default VideoBanner;
