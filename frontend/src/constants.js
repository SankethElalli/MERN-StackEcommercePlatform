// export const BASE_URL =
//   process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://westernstreet-api.vercel.app'  // Replace with your actual backend Vercel URL
  : 'http://localhost:5001';
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
