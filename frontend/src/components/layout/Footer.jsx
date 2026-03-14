import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES, THEME } from '@/config/constants';
import { 
  FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon,
  VisaIcon, MasterCardIcon, PayPalIcon, BitcoinIcon,
  DiamondIcon, ZapIcon 
} from '@/assets/icons';

/**
 * @module Footer
 * @description Premium cinematic footer for $10k+ enterprise marketplace
 * @author Senior Frontend Developer & UI/UX Expert
 * @version 2.0.0
 */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DiamondIcon className="w-8 h-8" style={{ color: THEME.COLORS.SECONDARY }} />
              <span className="text-2xl font-bold tracking-tighter uppercase">Global Auction</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              The world's premier destination for high-performance assets, luxury timepieces, and digital rarities. 
              Built for the elite, powered by AI.
            </p>
            <div className="flex gap-4">
              <FacebookIcon className="w-5 h-5 hover:text-gold transition-colors cursor-pointer" />
              <InstagramIcon className="w-5 h-5 hover:text-gold transition-colors cursor-pointer" />
              <TwitterIcon className="w-5 h-5 hover:text-gold transition-colors cursor-pointer" />
              <LinkedInIcon className="w-5 h-5 hover:text-gold transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-widest">Marketplace</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to={APP_ROUTES.SHOP} className="hover:text-gold transition-colors">Active Auctions</Link></li>
              <li><Link to={APP_ROUTES.HOME} className="hover:text-gold transition-colors">Recent Sales</Link></li>
              <li><Link to={APP_ROUTES.DASHBOARD} className="hover:text-gold transition-colors">Selling Hub</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Luxury Collections</Link></li>
            </ul>
          </div>

          {/* Column 3: Intelligence & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-gold transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Safe Trading</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-widest">Stay Ahead</h4>
            <p className="text-gray-400 text-xs mb-4">Get early access to exclusive drops and AI insights.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your VIP email" 
                className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-gold transition-all"
              />
              <button className="bg-gold text-black font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all active:scale-95">
                <ZapIcon className="w-4 h-4" /> SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <VisaIcon className="w-10" />
            <MasterCardIcon className="w-10" />
            <PayPalIcon className="w-10" />
            <BitcoinIcon className="w-10" />
            <CreditCardIcon className="w-10" />
          </div>
          <p className="text-gray-500 text-[10px] tracking-widest uppercase text-center md:text-right">
            © {currentYear} Global Auction Enterprise. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
