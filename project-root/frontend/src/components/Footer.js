import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center', marginTop: 'auto' }}>
      <p>&copy; {new Date().getFullYear()} AI-Commerce. All rights reserved.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <a href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
        <a href="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
        <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
