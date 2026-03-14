import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ROUTES, THEME } from '@/config/constants';
import { 
  DiamondIcon, SearchIcon, CartIcon, UserIcon, MenuIcon, CloseIcon 
} from '@/assets/icons';

/**
 * @module Navbar
 * @description Cinema-grade responsive navigation for $10k+ enterprise marketplace
 * @author Senior Frontend Architect
 * @version 3.0.0
 */

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { 
        setIsVisible(false); 
      } else {
        setIsVisible(true); 
      }
      setIsScrolled(window.scrollY > 20);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isVisible ? 'top-0' : '-top-24'
    } ${
      isScrolled ? 'py-3 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to={APP_ROUTES.HOME} className="flex items-center gap-2 group">
          <DiamondIcon className="w-8 h-8 transition-transform group-hover:rotate-12" style={{ color: THEME.COLORS.SECONDARY }} />
          <span className="text-xl font-bold tracking-tighter uppercase text-white">Global Auction</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Marketplace', path: APP_ROUTES.SHOP },
            { name: 'Dashboard', path: APP_ROUTES.DASHBOARD },
            { name: 'VIP Lounge', path: '/' },
          ].map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-sm font-medium text-gray-300 hover:text-gold transition-colors tracking-widest uppercase"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-6">
          <SearchIcon className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-all" />
          <div className="relative">
            <CartIcon className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-all" />
            <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </div>
          <UserIcon className="hidden md:block w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-all" />
          
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 flex flex-col p-6 gap-6 md:hidden backdrop-blur-xl"
          >
            <Link to={APP_ROUTES.SHOP} className="text-lg font-bold text-white uppercase tracking-widest">Marketplace</Link>
            <Link to={APP_ROUTES.DASHBOARD} className="text-lg font-bold text-white uppercase tracking-widest">Dashboard</Link>
            <Link to={APP_ROUTES.LOGIN} className="text-lg font-bold text-gold uppercase tracking-widest">Login / Register</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
