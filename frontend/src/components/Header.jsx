import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [expanded] = useState(false);  // Remove setExpanded since it's not used
  const [showDrawer, setShowDrawer] = useState(false);
  const { data: categories } = useGetCategoriesQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const closeDrawer = () => setShowDrawer(false);

  // Add useEffect to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {  // 768px is the typical breakpoint for mobile
        setShowDrawer(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header>
      <Navbar 
        bg='dark' 
        variant='dark' 
        expand='lg' 
        collapseOnSelect 
        className="py-2"
        expanded={expanded}
      >
        <Container>
          <Link to='/' className='navbar-brand d-flex align-items-center'>
            <img src={logo} alt='WesternStreet' className='navbar-logo me-2' />
            <span className="d-none d-sm-inline">WESTERN STREET</span>
          </Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' onClick={() => setShowDrawer(true)} />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox onSearchComplete={() => setShowDrawer(false)} />
              <Link to='/cart' className='nav-link'>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/myorders'>
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to='/login' className='nav-link'>
                  <FaUser /> Sign In
                </Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <NavDropdown.Item as={Link} to='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orderlist'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/userlist'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/categories'>
                    Categories
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/videobanners'>
                    Video Banners
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {userInfo && userInfo.isSeller && (
                <NavDropdown title='Seller' id='sellermenu'>
                  <NavDropdown.Item as={Link} to='/seller/dashboard'>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/seller/products'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/seller/orders'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/seller/profile'>
                    Shop Details
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showDrawer} onHide={closeDrawer} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {userInfo ? `Hello, ${userInfo.name}` : 'Menu'}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className='flex-column'>
            <SearchBox onSearchComplete={closeDrawer} />
            
            <Link to='/cart' className='nav-link mb-2' onClick={closeDrawer}>
              <FaShoppingCart /> Cart
              {cartItems.length > 0 && (
                <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </Badge>
              )}
            </Link>

            {userInfo ? (
              <>
                <Link to='/profile' className='nav-link mb-2' onClick={closeDrawer}>
                  <FaUser /> My Profile
                </Link>
                <Link to='/myorders' className='nav-link mb-2' onClick={closeDrawer}>
                  My Orders
                </Link>
                {userInfo.isAdmin && (
                  <div className="mb-2">
                    <h6 className="px-3 mt-3 mb-2 text-muted">Admin</h6>
                    <Link to='/admin/productlist' className='nav-link mb-1' onClick={closeDrawer}>Products</Link>
                    <Link to='/admin/orderlist' className='nav-link mb-1' onClick={closeDrawer}>Orders</Link>
                    <Link to='/admin/userlist' className='nav-link mb-1' onClick={closeDrawer}>Users</Link>
                    <Link to='/admin/categories' className='nav-link mb-1' onClick={closeDrawer}>Categories</Link>
                    <Link to='/admin/videobanners' className='nav-link mb-1' onClick={closeDrawer}>Video Banners</Link>
                  </div>
                )}
                {userInfo.isSeller && (
                  <div className="mb-2">
                    <h6 className="px-3 mt-3 mb-2 text-muted">Seller</h6>
                    <Link to='/seller/dashboard' className='nav-link mb-1' onClick={closeDrawer}>Dashboard</Link>
                    <Link to='/seller/products' className='nav-link mb-1' onClick={closeDrawer}>Products</Link>
                    <Link to='/seller/orders' className='nav-link mb-1' onClick={closeDrawer}>Orders</Link>
                    <Link to='/seller/profile' className='nav-link mb-1' onClick={closeDrawer}>Shop Details</Link>
                  </div>
                )}
                <hr />
                <button 
                  onClick={() => {
                    logoutHandler();
                    closeDrawer();
                  }}
                  className='btn btn-outline-danger w-100'
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to='/login' className='nav-link mb-2' onClick={closeDrawer}>
                <FaUser /> Sign In
              </Link>
            )}

            <hr />
            <div className="overflow-auto" style={{ maxHeight: '40vh' }}>
              <h6 className="px-3 mb-2 text-muted">Categories</h6>
              {categories?.map((category) => (
                <Link 
                  key={category._id}
                  to={category.path || `/category/${category.value}`}
                  className='nav-link mb-1'
                  onClick={closeDrawer}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
