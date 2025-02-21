import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import axios from 'axios';

// Remove Loader import since we're using ProgressBar instead

const VideoBannerUploadScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

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
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/api/upload/video', true);
      xhr.setRequestHeader('Authorization', `Bearer ${userInfo.token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentage));
        }
      };

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setVideoUrl(response.videoUrl);
          toast.success('Upload successful!');
        } else {
          throw new Error(xhr.responseText);
        }
        setUploading(false);
      };

      xhr.onerror = function() {
        toast.error('Upload failed');
        setUploading(false);
      };

      xhr.send(formData);
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
