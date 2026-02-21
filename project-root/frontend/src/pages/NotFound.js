import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>Oops! Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn" style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}>
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
