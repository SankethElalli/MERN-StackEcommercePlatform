import React, { useState, useEffect } from 'react';
// ...existing imports...

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="header">
      <div className="header__top">
        <div className="header__logo">
          <Link to="/">
            <img src="/images/logo.png" alt="WesternStreet" />
          </Link>
        </div>

        {isMobile && (
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="basic-navbar-nav"
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}
      </div>

      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon" />
      </div>

      <nav className={`header__nav ${isNavOpen ? 'show' : ''}`} id="basic-navbar-nav">
        <Link to={!user ? '/login' : ''} className="header__option">
          <span className="header__optionLineOne">
            Hello {!user ? 'Guest' : user.email}
          </span>
          <span className="header__optionLineTwo">
            {user ? 'Sign Out' : 'Sign In'}
          </span>
        </Link>

        <Link to="/orders" className="header__option">
          <span className="header__optionLineOne">Returns</span>
          <span className="header__optionLineTwo">& Orders</span>
        </Link>

        <Link to="/checkout" className="header__optionBasket">
          <ShoppingBasketIcon />
          <span className="header__optionLineTwo header__basketCount">
            {basket?.length}
          </span>
        </Link>
      </nav>
    </div>
  );
}

export default Header;
