import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Orders', path: '/orders' },
    { name: 'Analytics', path: '/analytics' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">🤖</span>
          <span className="logo-text">969 AI Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon" onClick={() => setIsMenuOpen(false)}>
            <span className="cart-icon-svg">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* Auth Buttons or Profile */}
          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          ) : (
            <div className="profile-container">
              <button 
                className="profile-btn" 
                onClick={toggleProfile}
                aria-label="User profile"
              >
                <span className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <span className="profile-name">{user?.name}</span>
                    <span className="profile-email">{user?.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    My Orders
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-content">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Mobile Auth Section */}
          <div className="mobile-auth-section">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-block">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-block">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="btn btn-secondary btn-block">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-danger btn-block">
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
