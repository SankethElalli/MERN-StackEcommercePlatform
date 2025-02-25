import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Remove Loader import since we're using ProgressBar instead

const VideoBannerUploadScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Current userInfo:', userInfo);
    if (!userInfo) {
      console.log('No user info found');
      navigate('/login');
      return;
    }
    if (!userInfo.isAdmin) {
      console.log('User is not admin:', userInfo);
      navigate('/login');
      return;
    }
    console.log('User is admin, allowing access');
  }, [userInfo, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size client-side
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 100MB');
      return;
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only MP4, MOV and WebM are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    setUploading(true);
    setProgress(0);

    try {
      if (!userInfo || !userInfo.isAdmin) {
        toast.error('Please login as admin');
        setUploading(false);
        navigate('/login');
        return;
      }

      console.log('Starting upload with token:', userInfo.token);

      const response = await axios.post('/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(Math.round(percentage));
        },
      });

      console.log('Upload response:', response);

      if (response.data && response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
        toast.success('Video uploaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
      setUploading(false);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/videobanners', { videoUrl });
      toast.success('Video banner created');
      navigate('/admin/videobanners');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error creating banner');
    }
  };

  return (
    <>
      <Link to='/admin/videobanners' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Upload Video Banner</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='video-file' className='my-3'>
            <Form.Label>Video (Max 100MB)</Form.Label>
            <Form.Control
              type='file'
              accept='video/*'
              onChange={uploadFileHandler}
            />
            {uploading && (
              <div className='mt-2'>
                <ProgressBar 
                  now={progress} 
                  label={`${progress}%`}
                  animated
                  variant="info"
                />
              </div>
            )}
          </Form.Group>

          {videoUrl && (
            <div className='my-3'>
              <video width="100%" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <Button
            type='submit'
            variant='primary'
            className='my-2'
            disabled={!videoUrl || uploading}
          >
            Create Banner
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default VideoBannerUploadScreen;
