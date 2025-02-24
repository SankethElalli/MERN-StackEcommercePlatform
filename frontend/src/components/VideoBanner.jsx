import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';
import '../assets/styles/VideoBanner.css';

const VideoBanner = () => {
  const [activeBanner, setActiveBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveBanner = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/videobanners/active');
      if (data && data.videoUrl) {
        setActiveBanner(data);
      }
    } catch (err) {
      setError('Failed to load banner');
      console.error('Banner fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBanner();
  }, [fetchActiveBanner]);

  if (loading) return <div className="video-banner-loading">Loading...</div>;
  if (error) return <div className="video-banner-error">{error}</div>;
  if (!activeBanner) return null;

  const videoUrl = `${BACKEND_URL}${activeBanner.videoUrl.replace('/uploads/uploads/', '/uploads/')}`;

  return (
    <div className="video-banner-container">
      <video 
        className="video-banner"
        autoPlay 
        loop 
        muted 
        playsInline
        key={videoUrl} // Force video reload when URL changes
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBanner;
