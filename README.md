# WesternStreet Multi-vendor Marketplace

A MERN Stack Multi-vendor E-commerce platform built with the MERN (MongoDB, Express, React, Node.js) stack and Redux Toolkit.

## Features

### Customer Features
- Full-featured shopping cart functionality
- Product search with filtering
- Responsive product catalog with pagination
- Product reviews and ratings system
- Top products carousel
- User profile with order history
- Checkout process (shipping, payment method)
- PayPal / Credit card integration

### Seller Features
- Seller dashboard
- Store profile management
- Product management with image upload
- Order management system
- Sales statistics

### Admin Features
- User management
- Product management
- Order management
- Admin dashboard
- Order status updates

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Bootstrap for UI
- Axios for API calls
- React Router v6

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- PayPal API integration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- PayPal Developer Account

### Environment Variables
Create a `.env` file in the root directory:

```
NODE_ENV = development
PORT = 5001
MONGO_URI = Your_mongodb_uri
JWT_SECRET = Your_jwt_secret
PAYPAL_CLIENT_ID = Your_paypal_client_id
PAGINATION_LIMIT = 8
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/SankethElalli/MERN-StackEcommercePlatform.git
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Setup upload directories
```bash
# Windows
mkdir uploads/products uploads/logos

# Linux/Mac
./scripts/setup-uploads.sh
```

### Running the Application

```bash
# Run both frontend & backend in development
npm run dev

# Run backend only
npm run server

# Run frontend only
cd frontend
npm start
```

### Database Seeding

```bash
# Import sample data
npm run data:import

# Destroy all data
npm run data:destroy
```

## Deployment

1. Create production build
```bash
cd frontend
npm run build
```

2. Set environment variables for production
3. Configure your hosting platform
4. Deploy the application

## Directory Structure

```
├── backend/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── screens/
│       ├── slices/
│       └── App.js
├── uploads/
│   ├── products/
│   └── logos/
└── package.json
```

## API Endpoints

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin/Seller)
- PUT /api/products/:id (Admin/Seller)
- DELETE /api/products/:id (Admin/Seller)

### Users
- POST /api/users/login
- POST /api/users/register
- GET /api/users/profile
- PUT /api/users/profile

### Orders
- POST /api/orders
- GET /api/orders/myorders
- GET /api/orders/:id
- PUT /api/orders/:id/pay
- PUT /api/orders/:id/deliver (Admin)