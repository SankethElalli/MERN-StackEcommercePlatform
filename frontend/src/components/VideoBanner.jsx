import React, { useRef, useEffect, useState } from 'react';
import { BACKEND_URL } from '../utils/constants';
import '../assets/styles/VideoBanner.css';

const VideoBanner = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(console.error);
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [videoUrl]);

  if (!videoUrl) return null;

  // Remove duplicate 'uploads' in path if present
  const fullVideoUrl = `${BACKEND_URL}${videoUrl.replace('/uploads/uploads/', '/uploads/')}`;

  return (
    <div className="video-banner">
      {isLoading && (
        <div className="video-loader">
          <div className="spinner"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className={`home-banner-video ${!isLoading ? 'loaded' : ''}`}
        playsInline
        muted
        loop
        preload="auto"
      >
        <source src={fullVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBanner;
