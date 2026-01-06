import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center', marginTop: 'auto' }}>
      <p>&copy; 2023 AI-Commerce. All rights reserved.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;