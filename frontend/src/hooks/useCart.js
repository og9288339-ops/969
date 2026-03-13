/**
 * @module useCart
 * @description Premium React Hook for luxury e-commerce cart management
 * @author Senior Frontend Architect
 * @version 1.3.0
 * @since 2024
 */

import { useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Optional toast library
import { useCart as useCartContext } from './CartContext'; // Your CartContext
import { motion } from 'framer-motion';

/**
 * @typedef {Object} CartReturn
 * @property {Array} cartItems - Cart contents
 * @property {number} cartTotal - Total cart value
 * @property {number} cartCount - Item count
 * @property {boolean} isCartOpen - Sidebar state
 * @property {boolean} isInCart - Check if item exists
 * @property {Function} toggleCart - Animated sidebar toggle
 * @property {Function} addItemToCart - Add with toast
 * @property {Function} removeItemFromCart - Remove with toast
 * @property {Function} updateQuantity - Update with toast
 * @property {Function} clearCart - Empty cart
 * @property {Function} getCartTax - Dynamic tax calculation
 * @property {Object} cartSidebarVariants - Framer Motion presets
 */

/**
 * Production-grade useCart Hook - Luxury E-commerce Ready
 * @returns {CartReturn} Complete cart management interface
 */
export const useCart = () => {
  const context = useCartContext();

  /**
   * Check if product is already in cart
   * @param {string} productId - Product ID to check
   * @returns {boolean} True if item exists in cart
   */
  const isInCart = useCallback((productId) => {
    return context.cartItems.some(item => item.id === productId);
  }, [context.cartItems]);

  /**
   * Toggle cart sidebar with Framer Motion support
   */
  const toggleCart = useCallback(() => {
    context.toggleCart();
    
    if (!context.isCartOpen) {
      toast('Cart opened', {
        icon: '🛒',
        duration: 1000
      });
    }
  }, [context.toggleCart, context.isCartOpen]);

  /**
   * Enhanced addItemToCart with toast feedback
   */
  const addItemToCart = useCallback((product, quantity = 1) => {
    context.addItemToCart(product, quantity);
    // Toast already handled in CartContext
  }, [context.addItemToCart]);

  /**
   * Enhanced removeItemFromCart with toast
   */
  const removeItemFromCart = useCallback((productId) => {
    context.removeItemFromCart(productId);
    // Toast already handled in CartContext
  }, [context.removeItemFromCart]);

  /**
   * Enhanced updateQuantity with toast
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    context.updateQuantity(productId, newQuantity);
    // Toast handled in CartContext
  }, [context.updateQuantity]);

  /**
   * Calculate tax dynamically
   * @param {number} [taxRate=0.08] - Tax rate (8% default)
   * @returns {number} Tax amount
   */
  const getCartTax = useCallback((taxRate = 0.08) => {
    return context.cartTotal * taxRate;
  }, [context.cartTotal]);

  /**
   * Pre-configured Framer Motion variants for cart sidebar
   */
  const cartSidebarVariants = useMemo(() => ({
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    }
  }), []);

  /**
   * Fully memoized return value - PERFORMANCE GUARANTEED
   */
  return useMemo(() => ({
    // Core cart data
    cartItems: context.cartItems,
    cartTotal: context.cartTotal,
    cartCount: context.cartCount,
    isCartOpen: context.isCartOpen,

    // Smart helpers
    isInCart,

    // Enhanced actions
    toggleCart,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCart: context.clearCart,

    // Checkout utilities
    getCartTax,

    // Animation presets
    cartSidebarVariants
  }), [
    context.cartItems,
    context.cartTotal,
    context.cartCount,
    context.isCartOpen,
    context.clearCart,
    isInCart,
    toggleCart,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    getCartTax,
    cartSidebarVariants
  ]);
};

export default useCart;
