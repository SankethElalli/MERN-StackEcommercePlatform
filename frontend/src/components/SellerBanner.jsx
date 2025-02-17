import React from 'react';
import { Card } from 'react-bootstrap';

const SellerBanner = ({ seller }) => {
  if (!seller) return null;

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        {seller.logo && (
          <img
            src={seller.logo}
            alt={seller.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #eee',
              marginRight: '20px'
            }}
          />
        )}
        <div>
          <h2 className="mb-1">{seller.name}</h2>
          {seller.description && (
            <p className="text-muted mb-0">{seller.description}</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SellerBanner;
