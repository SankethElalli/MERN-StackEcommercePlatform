import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../slices/categoriesApiSlice';

const CategoryListScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [path, setPath] = useState('');

  // Get categories
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();

  // Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleShowModal = (edit = false, category = null) => {
    setEditMode(edit);
    if (edit && category) {
      setCurrentCategory(category);
      setName(category.name);
      setValue(category.value);
      setPath(category.path);
    } else {
      setCurrentCategory(null);
      setName('');
      setValue('');
      setPath('/category/');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory(null);
  };

  const handleSaveCategory = async () => {
    if (!name || !value) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate path if not provided
    const finalPath = path || `/category/${value.toLowerCase()}`;

    try {
      if (editMode && currentCategory) {
        // Update existing category
        await updateCategory({
          _id: currentCategory._id,
          name,
          value,
          path: finalPath,
        }).unwrap();
        toast.success('Category updated successfully');
      } else {
        // Add new category
        await createCategory({
          name,
          value,
          path: finalPath,
        }).unwrap();
        toast.success('Category added successfully');
      }
      
      // Refresh the categories list
      refetch();
      
      // Close modal
      handleCloseModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId).unwrap();
        toast.success('Category deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Auto-generate value and path when name changes
  useEffect(() => {
    if (!editMode) {
      const generatedValue = name.toLowerCase().replace(/\s+/g, '-');
      setValue(generatedValue);
      setPath(`/category/${generatedValue}`);
    }
  }, [name, editMode]);

  const handleNameChange = (e) => {
    setName(e.target.value.toUpperCase());
  };

  const submitHandler = (e) => {
    e.preventDefault();
    handleSaveCategory();
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={() => handleShowModal()}>
            <FaPlus /> Add Category
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>VALUE</th>
                <th>PATH</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.value}</td>
                  <td>{category.path}</td>
                  <td>
                    <Button
                      variant='dark'
                      className='btn-sm mx-2'
                      onClick={() => handleShowModal(true, category)}
                      disabled={isDeleting}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => handleDeleteCategory(category._id)}
                      disabled={isDeleting}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Add/Edit Category Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{editMode ? 'Edit Category' : 'Add Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                  <Form.Label>Name (Display Text)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter category name (e.g. FOOTWEAR)'
                    value={name}
                    onChange={handleNameChange}
                    required
                  ></Form.Control>
                  <Form.Text className="text-muted">
                    This is the text shown to users in the category bar.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId='value' className='my-2'>
                  <Form.Label>Value (Database Value)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Auto-generated from name'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  ></Form.Control>
                  <Form.Text className="text-muted">
                    This is the value stored in the database and used for filtering.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId='path' className='my-2'>
                  <Form.Label>Path (URL)</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Auto-generated from value'
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                  ></Form.Control>
                  <Form.Text className="text-muted">
                    This is the URL path for the category page.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant='secondary' 
                    onClick={handleCloseModal}
                    className='me-2'
                  >
                    Cancel
                  </Button>
                  <Button 
                    type='submit' 
                    variant='primary'
                  >
                    {editMode ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default CategoryListScreen;
