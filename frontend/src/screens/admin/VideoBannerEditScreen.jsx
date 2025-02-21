import React, { useState } from 'react'; // Remove useEffect
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useUploadVideoMutation } from '../../slices/uploadApiSlice';
import { UPLOADS_URL } from '../../utils/constants';

const VideoBannerEditScreen = () => {
  const navigate = useNavigate();
  const [uploadVideo, { isLoading: uploading }] = useUploadVideoMutation();

  const [bannerData, setBannerData] = useState({
    videoUrl: '',
    overlayText: '',
    ctaText: '',
    ctaLink: ''
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await uploadVideo(formData).unwrap();
      setBannerData(prev => ({ ...prev, videoUrl: res.video }));
      toast.success('Video uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Save banner data to backend (implement this part)
    try {
      // Add your save logic here
      toast.success('Banner updated successfully');
      navigate('/admin/banners');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Edit Video Banner</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='video'>
          <Form.Label>Video</Form.Label>
          <Row>
            <Col md={8}>
              <Form.Control
                type='text'
                placeholder='Video URL'
                value={bannerData.videoUrl}
                onChange={(e) => setBannerData(prev => ({ ...prev, videoUrl: e.target.value }))}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type='file'
                accept='video/*'
                onChange={handleUpload}
                className='mb-3'
              />
            </Col>
          </Row>
          {uploading && <Loader />}
          {bannerData.videoUrl && (
            <video 
              width="100%" 
              controls 
              className="mt-3"
              src={bannerData.videoUrl.startsWith('/uploads') 
                ? `${UPLOADS_URL}${bannerData.videoUrl.substring(8)}` 
                : bannerData.videoUrl}
            />
          )}
        </Form.Group>

        <Form.Group controlId='overlayText' className='my-2'>
          <Form.Label>Overlay Text</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter overlay text'
            value={bannerData.overlayText}
            onChange={(e) => setBannerData(prev => ({ ...prev, overlayText: e.target.value }))}
          />
        </Form.Group>

        <Form.Group controlId='ctaText' className='my-2'>
          <Form.Label>CTA Text</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter call-to-action text'
            value={bannerData.ctaText}
            onChange={(e) => setBannerData(prev => ({ ...prev, ctaText: e.target.value }))}
          />
        </Form.Group>

        <Form.Group controlId='ctaLink' className='my-2'>
          <Form.Label>CTA Link</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter call-to-action link'
            value={bannerData.ctaLink}
            onChange={(e) => setBannerData(prev => ({ ...prev, ctaLink: e.target.value }))}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Update Banner
        </Button>
      </Form>
    </FormContainer>
  );
};

export default VideoBannerEditScreen;
