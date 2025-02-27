export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '';
export const UPLOADS_URL = `${BACKEND_URL}/uploads`;

export const PRODUCT_CATEGORIES = [
  { name: 'FOOTWEAR', value: 'footwear', path: '/category/footwear' },
  { name: 'APPAREL', value: 'apparel', path: '/category/apparel' },
  { name: 'LIFESTYLE', value: 'lifestyle', path: '/category/lifestyle' },
  { name: 'VEGNNONVEG', value: 'vegnnonveg', path: '/category/vegnnonveg' },
  { name: 'BRANDS', value: 'brands', path: '/category/brands' },
  { name: 'SHOP THE LOOK', value: 'shop-the-look', path: '/category/shop-the-look' },
  { name: 'VNV MAGAZINE', value: 'vnv-magazine', path: '/category/vnv-magazine' },
  { name: 'MARKDOWNS', value: 'markdowns', path: '/category/markdowns' },
];
