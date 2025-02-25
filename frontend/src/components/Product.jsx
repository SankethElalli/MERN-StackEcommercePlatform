import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import '../assets/styles/custom.css';

// Default placeholder image
const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded animated-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img 
            src={product.image} 
            variant='top' 
            className='product-image' 
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
      </Link>
      <Card.Body>
        {/* Seller Info with Debug */}
        {product.seller && (
          <div className="d-flex align-items-center mb-2">
            {product.seller.seller && product.seller.seller.logo ? (
              <img 
                src={product.seller.seller.logo}
                alt={product.seller.name}
                style={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  marginRight: '8px',
                  objectFit: 'cover'
                }}
              />
            ) : null}
            <small className="text-muted">
              Sold by: {product.seller.name}
            </small>
          </div>
        )}

        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='product-name'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3' className='product-price'>
          ₹{product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;