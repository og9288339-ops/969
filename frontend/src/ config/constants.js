/**
 * @module constants
 * @description Source of Truth for $10k+ enterprise MERN marketplace
 * @author Senior Frontend Architect
 * @version 2.0.0
 */

/**
 * @description API Endpoints organized by domain
 */
export const API_ENDPOINTS = Object.freeze({
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    BASE: '/products',
    DETAILS: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
  },
  USER: {
    PROFILE: '/users/profile',
    ORDERS: '/users/orders',
  },
  AI: {
    CHAT: '/ai/chat',
    RECOMMENDATIONS: '/ai/recommendations',
  }
});

/**
 * @description Application Route constants
 */
export const APP_ROUTES = Object.freeze({
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAILS: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
});

/**
 * @description Luxury Theme Configuration
 */
export const THEME = Object.freeze({
  COLORS: {
    PRIMARY: '#000000',      
    SECONDARY: '#FFD700',    
    ACCENT: '#1A1A1A',       
    ERROR: '#D32F2F',
    SUCCESS: '#388E3C',
    WHITE: '#FFFFFF',
  },
  ANIMATIONS: {
    DURATION: 0.3,           
    EASE: [0.43, 0.13, 0.23, 0.96],
  }
});

/**
 * @description Global App Settings
 */
export const SETTINGS = Object.freeze({
  CURRENCIES: ['USD', 'EGP', 'BTC'],
  DEFAULT_CURRENCY: 'USD',
  LANGUAGES: ['ar', 'en'],
  DEFAULT_LANG: 'ar',
});

/**
 * @description LocalStorage keys for consistency
 */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME_MODE: 'themeMode',
  CART_ITEMS: 'cartItems',
});

export default {
  API_ENDPOINTS,
  APP_ROUTES,
  THEME,
  SETTINGS,
  STORAGE_KEYS
};
