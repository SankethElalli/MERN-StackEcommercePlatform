import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import '../assets/styles/custom.css';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded shadow-sm product-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className='product-image' />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-name'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='h3' className='product-price'>
          ₹{product.price}
        </Card.Text>
        <Card.Text as='div'>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;