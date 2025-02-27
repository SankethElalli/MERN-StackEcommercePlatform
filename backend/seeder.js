import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate MongoDB URI
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables'.red.bold);
  process.exit(1);
}

import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Category from './models/categoryModel.js';
import connectDB from './config/db.js';

// Sample categories
const categories = [
  { name: 'FOOTWEAR', value: 'footwear', path: '/category/footwear' },
  { name: 'APPAREL', value: 'apparel', path: '/category/apparel' },
  { name: 'LIFESTYLE', value: 'lifestyle', path: '/category/lifestyle' },
  { name: 'VEGNNONVEG', value: 'vegnnonveg', path: '/category/vegnnonveg' },
  { name: 'BRANDS', value: 'brands', path: '/category/brands' },
  { name: 'SHOP THE LOOK', value: 'shop-the-look', path: '/category/shop-the-look' },
  { name: 'VNV MAGAZINE', value: 'vnv-magazine', path: '/category/vnv-magazine' },
  { name: 'MARKDOWNS', value: 'markdowns', path: '/category/markdowns' },
];

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdUsers = await User.insertMany(users);
    await Category.insertMany(categories);

    const adminUser = createdUsers[0]._id;
    const sellerUser = createdUsers.find(user => user.isSeller)?._id || adminUser;

    const sampleProducts = products.map((product) => {
      return { 
        ...product, 
        user: adminUser,
        seller: sellerUser, 
        category: product.category || 'footwear' 
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
