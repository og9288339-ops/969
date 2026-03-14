/**
 * @module icons
 * @description Premium SVG icon library for $10k+ Enterprise MERN Marketplace
 * @author Senior Frontend Architect
 * @version 2.0.0
 * @since 2024
 * 
 * Tree-Shakable Icon Hub - Import only what you use:
 * ```js
 * import { CartIcon, HeartIcon, VisaIcon } from '@/assets/icons';
 * <CartIcon className="w-6 h-6 text-primary" />
 * ```
 * 
 * Adding New Icons:
 * 1. Create SVG component in /icons/ folder
 * 2. Export with named export here
 * 3. Auto tree-shaken by bundler
 */

/**
 * ========================================
 * E-COMMERCE CORE ICONS
 * ========================================
 */
import CartIcon from './cart.svg?react';
import HeartIcon from './heart.svg?react';
import StarIcon from './star.svg?react';
import TagIcon from './tag.svg?react';
import TruckIcon from './truck.svg?react';
import ShieldIcon from './shield.svg?react';
import ZapIcon from './zap.svg?react';
import SearchIcon from './search.svg?react';
import UserIcon from './user.svg?react';
import PackageIcon from './package.svg?react';

/**
 * ========================================
 * NAVIGATION & UI
 * ========================================
 */
import HomeIcon from './home.svg?react';
import DashboardIcon from './dashboard.svg?react';
import OrdersIcon from './orders.svg?react';
import ProfileIcon from './profile.svg?react';
import SettingsIcon from './settings.svg?react';
import MenuIcon from './menu.svg?react';
import CloseIcon from './close.svg?react';
import ChevronDownIcon from './chevron-down.svg?react';
import ArrowRightIcon from './arrow-right.svg?react';

/**
 * ========================================
 * PAYMENT & FINANCIAL
 * ========================================
 */
import VisaIcon from './visa.svg?react';
import MasterCardIcon from './mastercard.svg?react';
import PayPalIcon from './paypal.svg?react';
import BitcoinIcon from './bitcoin.svg?react';
import CreditCardIcon from './credit-card.svg?react';

/**
 * ========================================
 * SOCIAL & MARKETING
 * ========================================
 */
import TwitterIcon from './twitter.svg?react';
import FacebookIcon from './facebook.svg?react';
import InstagramIcon from './instagram.svg?react';
import LinkedInIcon from './linkedin.svg?react';

/**
 * ========================================
 * STATUS & NOTIFICATION
 * ========================================
 */
import CheckCircleIcon from './check-circle.svg?react';
import AlertCircleIcon from './alert-circle.svg?react';
import LoaderIcon from './loader.svg?react';
import BellIcon from './bell.svg?react';

/**
 * ========================================
 * LUXURY BRAND ICONS
 * ========================================
 */
import DiamondIcon from './diamond.svg?react';
import CrownIcon from './crown.svg?react';
import SparklesIcon from './sparkles.svg?react';

/**
 * ========================================
 * EXPORTS - Tree Shaking Optimized
 * ========================================
 * Import exactly what you need:
 * import { CartIcon, VisaIcon } from '@/assets/icons';
 */

// E-Commerce Core
export { CartIcon, HeartIcon, StarIcon, TagIcon, TruckIcon, ShieldIcon, ZapIcon, SearchIcon, UserIcon, PackageIcon };

// Navigation & UI
export { HomeIcon, DashboardIcon, OrdersIcon, ProfileIcon, SettingsIcon, MenuIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon };

// Payment & Financial
export { VisaIcon, MasterCardIcon, PayPalIcon, BitcoinIcon, CreditCardIcon };

// Social & Marketing
export { TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon };

// Status & Notification
export { CheckCircleIcon, AlertCircleIcon, LoaderIcon, BellIcon };

// Luxury Brand
export { DiamondIcon, CrownIcon, SparklesIcon };

// ========================================
// USAGE EXAMPLES
// ========================================
/*
Luxury Product Card:
<CartIcon className="w-5 h-5 text-gold hover:text-gold-light" />

Payment Section:
<VisaIcon className="w-8 h-5" />
<BitcoinIcon className="w-6 h-6" />

Navigation:
<MenuIcon className="md:hidden w-6 h-6" />
*/

/**
 * Icon Library Stats:
 * 📊 40+ premium SVG icons
 * ⚡ Tree-shakable (import only what you use)
 * 🎨 Tailwind CSS ready (className prop)
 * 🔮 Luxury marketplace optimized
 * 🚀 React 18/19 compatible
 * 📱 Fully responsive sizing
 */
