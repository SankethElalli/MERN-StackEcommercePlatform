import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import './assets/styles/custom.css'; // Ensure this line is present
import './assets/styles/theme.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SellerDashboardScreen from './screens/seller/SellerDashboardScreen';
import SellerProductListScreen from './screens/seller/SellerProductListScreen';
import SellerProductEditScreen from './screens/seller/SellerProductEditScreen';
import SellerOrderListScreen from './screens/seller/SellerOrderListScreen';
import SellerProfileScreen from './screens/seller/SellerProfileScreen';
import VideoBannerEditScreen from './screens/admin/VideoBannerEditScreen';
import VideoBannerListScreen from './screens/admin/VideoBannerListScreen';
import VideoBannerUploadScreen from './screens/admin/VideoBannerUploadScreen';
import store from './store';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<ErrorBoundary />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/myorders' element={<MyOrdersScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListScreen />}
        />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
        <Route path='/admin/banner' element={<VideoBannerEditScreen />} />
        <Route path='/admin/videobanners' element={<VideoBannerListScreen />} />
        <Route path='/admin/videobanner/upload' element={<VideoBannerUploadScreen />} />
      </Route>
      {/* Seller Routes */}
      <Route path='' element={<SellerRoute />}>
        <Route path='/seller/dashboard' element={<SellerDashboardScreen />} />
        <Route path='/seller/products' element={<SellerProductListScreen />} />
        <Route 
          path='/seller/orders' 
          element={<SellerOrderListScreen />} 
          errorElement={<ErrorBoundary />} 
        />
        <Route 
          path='/seller/product/:id/edit' 
          element={<SellerProductEditScreen />} 
        />
        <Route path='/seller/profile' element={<SellerProfileScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
