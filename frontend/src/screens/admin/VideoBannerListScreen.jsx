import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useGetVideoBannersQuery, useDeleteVideoBannerMutation, useUpdateVideoBannerStatusMutation } from '../../slices/videoBannersApiSlice';

const VideoBannerListScreen = () => {
  const { data: banners = [], isLoading, error, refetch } = useGetVideoBannersQuery();
  const [deleteVideoBanner] = useDeleteVideoBannerMutation();
  const [updateStatus] = useUpdateVideoBannerStatusMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this video banner?')) {
      try {
        await deleteVideoBanner(id).unwrap();
        refetch();
        toast.success('Video banner deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.message || 'Error deleting banner');
      }
    }
  };

  const toggleStatusHandler = async (id, currentStatus) => {
    try {
      await updateStatus({ id, isActive: !currentStatus }).unwrap();
      refetch();
      toast.success('Video banner status updated');
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Error updating status');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.message}</Message>;

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Video Banners</h1>
        </Col>
        <Col className='text-end'>
          <Link to='/admin/videobanner/upload' className='btn btn-primary btn-sm m-3'>
            <FaEdit /> Upload New Video Banner
          </Link>
        </Col>
      </Row>

      {banners.length === 0 ? (
        <Message>No video banners found</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>VIDEO</th>
              <th>STATUS</th>
              <th>UPLOADED AT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>{banner._id}</td>
                <td>
                  {banner.videoUrl && (
                    <video width="200" controls>
                      <source src={banner.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </td>
                <td>
                  <Button
                    variant={banner.isActive ? 'success' : 'danger'}
                    className='btn-sm'
                    onClick={() => toggleStatusHandler(banner._id, banner.isActive)}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Button>
                </td>
                <td>{banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(banner._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default VideoBannerListScreen;
