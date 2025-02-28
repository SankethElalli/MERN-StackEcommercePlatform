import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import { useState } from 'react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [expanded, setExpanded] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

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
              <SearchBox />
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
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={showDrawer} onHide={closeDrawer} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SearchBox />
          <Nav className='flex-column'>
            <Link to='/cart' className='nav-link' onClick={closeDrawer}>
              <FaShoppingCart /> Cart
            </Link>
            {userInfo ? (
              <Link to='/profile' className='nav-link' onClick={closeDrawer}>
                <FaUser /> Profile
              </Link>
            ) : (
              <Link to='/login' className='nav-link' onClick={closeDrawer}>
                <FaUser /> Sign In
              </Link>
            )}
            <NavDropdown title='Categories' id='categories-dropdown'>
              <NavDropdown.Item as={Link} to='/category/footwear' onClick={closeDrawer}>Footwear</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/category/yeezy' onClick={closeDrawer}>Yeezy</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/category/nike' onClick={closeDrawer}>Nike</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/category/adidas' onClick={closeDrawer}>Adidas</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/category/jordans' onClick={closeDrawer}>Jordans</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
