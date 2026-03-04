import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ background: '#fff', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          AI-Commerce
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/products" style={{ textDecoration: 'none', color: '#333' }}>Products</Link>
          <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', color: '#333' }}>
            <FaShoppingCart size={20} />
            {getItemCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: '#007bff',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.8rem'
              }}>
                {getItemCount()}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
                <FaUser size={20} />
              </Link>
              {user.role === 'admin' && <Link to="/admin" style={{ textDecoration: 'none', color: '#333' }}>Admin</Link>}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;