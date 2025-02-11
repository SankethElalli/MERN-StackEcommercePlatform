import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import '../assets/styles/custom.css';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded animated-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className='animated-img' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title animated-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3' className='animated-price'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
