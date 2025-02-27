import React, { useState } from 'react';
import { Row, Col, Container, Breadcrumb } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { PRODUCT_CATEGORIES } from '../utils/constants';

const CategoryScreen = () => {
  const { category } = useParams();
  const [page, setPage] = useState(1); // eslint-disable-line no-unused-vars
  
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: '',
    pageNumber: page,
  });

  // Get categories from API
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  // Format category name for display
  const formattedCategoryName = category
    ? category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  // Find the matching category from API or fallback to constants
  const categoryInfo = categories
    ? categories.find(cat => cat.value === category)
    : PRODUCT_CATEGORIES.find(cat => cat.value === category);

  // Filter products by category (case insensitive)
  const filteredProducts = data?.products?.filter(
    product => product.category?.toLowerCase() === category?.toLowerCase()
  ) || [];

  return (
    <>
      <Meta title={`${categoryInfo?.name || formattedCategoryName} - WesternStreet`} />
      <Container>
        <Breadcrumb className="my-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{categoryInfo?.name || formattedCategoryName}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="mb-4">{categoryInfo?.name || formattedCategoryName}</h1>

        {isLoading || categoriesLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <Message>
                No products found in {categoryInfo?.name || formattedCategoryName}.
                <Link to="/" className="d-block mt-3">
                  Return to Home
                </Link>
              </Message>
            ) : (
              <>
                <Row>
                  {filteredProducts.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
                {data.pages > 1 && (
                  <Paginate
                    pages={data.pages}
                    page={data.page}
                    keyword={category}
                  />
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default CategoryScreen;
