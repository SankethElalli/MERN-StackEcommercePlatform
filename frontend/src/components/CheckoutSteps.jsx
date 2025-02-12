import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/styles/custom.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4 animated-nav'>
      <Nav.Item>
        {step1 ? (
          <Nav.Link as={Link} to='/login' className='animated-link'>
            Sign In
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='animated-link'>
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as={Link} to='/shipping' className='animated-link'>
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='animated-link'>
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as={Link} to='/payment' className='animated-link'>
            Payment (₹)
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='animated-link'>
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as={Link} to='/placeorder' className='animated-link'>
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled className='animated-link'>
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
