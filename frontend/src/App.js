import React, { Suspense } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Pages where we don't want to show the category bar
  const hideCategoryBarPaths = [
    '/login',
    '/register',
    '/shipping',
    '/payment',
    '/placeorder',
    '/profile',
  ];
  
  // Check if the current path is in the list of paths where we don't want to show the category bar
  const shouldShowCategoryBar = !hideCategoryBarPaths.some(path => 
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Header />
      {shouldShowCategoryBar && <CategoryBar />}
      <main className='py-3'>
        <Container>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
