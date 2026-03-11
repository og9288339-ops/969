import React, { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Mail,
  ChevronRight,
  Shield,
  CreditCard,
  Bitcoin,
  Globe
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      setSubscribeStatus('error');
    }
  };

  const navLinks = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products/new' },
      { name: 'Best Sellers', href: '/products/bestsellers' },
      { name: 'Sale', href: '/products/sale' },
      { name: 'Collections', href: '/collections' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Track Order', href: '/track' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  ];

  const paymentMethods = [
    { icon: CreditCard, name: 'Visa' },
    { icon: CreditCard, name: 'MasterCard' },
    { icon: Bitcoin, name: 'Bitcoin' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Join the Elite</h2>
            <p className="newsletter-description">
              Subscribe to receive exclusive offers, early access to new collections, 
              and personalized recommendations.
            </p>
          </div>
          
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeStatus === 'loading'}
                className={`newsletter-input ${subscribeStatus === 'error' ? 'error' : ''}`}
                aria-label="Email address for newsletter subscription"
              />
              {subscribeStatus === 'error' && (
                <span className="error-message">Please enter a valid email</span>
              )}
            </div>
            <button 
              type="submit" 
              className={`subscribe-btn ${subscribeStatus === 'loading' ? 'loading' : ''}`}
              disabled={subscribeStatus === 'loading'}
            >
              {subscribeStatus === 'loading' ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          {/* Branding Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🤖</span>
              <span className="logo-text">969 AI Store</span>
            </div>
            <p className="footer-description">
              Redefining luxury e-commerce with AI-powered personalization. 
              Experience the future of shopping today.
            </p>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <nav className="footer-nav">
            <div className="nav-column">
              <h3 className="nav-title">Shop</h3>
              <ul className="nav-links">
                {navLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="nav-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-column">
              <h3 className="nav-title">Company</h3>
              <ul className="nav-links">
                {navLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="nav-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-column">
              <h3 className="nav-title">Support</h3>
              <ul className="nav-links">
                {navLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="nav-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-column">
              <h3 className="nav-title">Legal</h3>
              <ul className="nav-links">
                {navLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="nav-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="bottom-left">
            <p className="copyright">
              © {new Date().getFullYear()} 969 AI Store. All rights reserved.
            </p>
          </div>
          
          <div className="bottom-center">
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div key={method.name} className="payment-item" title={method.name}>
                  <method.icon size={24} />
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-right">
            <div className="trust-badges">
              <div className="badge">
                <Shield size={16} />
                <span>Secure</span>
              </div>
              <div className="badge">
                <Globe size={16} />
                <span>Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
