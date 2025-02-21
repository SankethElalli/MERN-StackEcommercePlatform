import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery, useGetActiveVideoBannerQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import VideoBanner from '../components/VideoBanner';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });
  const { data: banner } = useGetActiveVideoBannerQuery(); // Remove unused bannerLoading

  console.log('Banner data:', banner); // Debug log

  return (
    <>
      <Meta />
      {!keyword && banner && banner.videoUrl && (
        <VideoBanner videoUrl={banner.videoUrl} />
      )}

      <Container>
        <div className='section-header text-center my-5'>
          <h1 className='modern-title no-after'>Featured Collection</h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Row>
              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='mb-4'>
                  <div className='product-card-wrapper h-100'>
                    <Product product={product} />
                  </div>
                </Col>
              ))}
            </Row>
            <div className='d-flex justify-content-center mt-4'>
              <Paginate 
                pages={data.pages} 
                page={data.page} 
                keyword={keyword ? keyword : ''}
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
