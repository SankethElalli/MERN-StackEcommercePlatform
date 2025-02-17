import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useUpdateSellerProfileMutation, useUploadLogoMutation } from '../../slices/sellerApiSlice';
import { setCredentials } from '../../slices/authSlice';

const SellerProfileScreen = () => {
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateSellerProfile, { isLoading: loadingUpdate }] = useUpdateSellerProfileMutation();
  const [uploadLogo, { isLoading: loadingUpload }] = useUploadLogoMutation();

  useEffect(() => {
    if (userInfo && userInfo.seller) {
      setSellerName(userInfo.seller.name || '');
      setSellerLogo(userInfo.seller.logo || '');
      setSellerDescription(userInfo.seller.description || '');
    }
  }, [userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadLogo(formData).unwrap();
      toast.success('Logo uploaded successfully');
      setSellerLogo(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateSellerProfile({
        sellerName,
        sellerLogo,
        sellerDescription,
      }).unwrap();
      
      // Update the userInfo in Redux store with the new seller data
      dispatch(setCredentials({
        ...userInfo,
        seller: res.seller
      }));
      
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Seller Profile</h1>
      {loadingUpdate && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='sellerName' className='my-2'>
          <Form.Label>Store Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter store name'
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='image' className='my-2'>
          <Form.Label>Logo</Form.Label>
          <Form.Control
            type='file'
            onChange={uploadFileHandler}
          />
          {loadingUpload && <Loader />}
          {sellerLogo && (
            <img
              src={sellerLogo}
              alt="Store Logo"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                marginTop: '10px',
                borderRadius: '50%'
              }}
            />
          )}
        </Form.Group>

        <Form.Group controlId='sellerDescription' className='my-2'>
          <Form.Label>Store Description</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Enter store description'
            value={sellerDescription}
            onChange={(e) => setSellerDescription(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='my-2'>
          Update Profile
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SellerProfileScreen;
