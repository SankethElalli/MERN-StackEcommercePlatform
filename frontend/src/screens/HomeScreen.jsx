import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import '../assets/styles/custom.css';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  return (
    <div className='home-container fade-in'>
      {!keyword ? (
        <div className='hero-section'>
          <ProductCarousel />
        </div>
      ) : (
        <Link to='/' className='modern-button btn-light mb-4'>
          Go Back
        </Link>
      )}
      
      <div className='products-section'>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <>
            <Meta />
            <div className='section-header'>
              <h1 className='modern-title text-center'>Latest Products</h1>
            </div>
            <Row className='product-grid'>
              {data.products.map((product) => (
                <Col 
                  key={product._id} 
                  sm={12} 
                  md={6} 
                  lg={4} 
                  xl={3} 
                  className='mb-4 product-column'
                >
                  <div className='product-wrapper'>
                    <Product product={product} />
                  </div>
                </Col>
              ))}
            </Row>
            <div className='pagination-wrapper mt-4'>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
