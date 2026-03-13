/**
 * @module CartContext
 * @description Production-ready React Context for luxury e-commerce cart management
 * @author Senior React Architect
 * @version 2.0.0
 * @since 2024
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo, 
  useEffect 
} from 'react';
import { toast } from 'react-hot-toast'; // Optional toast library

/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique product ID
 * @property {string} name - Product name
 * @property {string} image - Product image URL
 * @property {number} price - Unit price
 * @property {number} quantity - Item quantity
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} cartItems - Array of cart items
 * @property {number} cartTotal - Total cart value
 * @property {number} cartCount - Total item count
 * @property {boolean} isCartOpen - Cart sidebar toggle
 * @property {Function} addItemToCart - Add/update item in cart
 * @property {Function} removeItemFromCart - Remove item from cart
 * @property {Function} updateQuantity - Update item quantity
 * @property {Function} clearCart - Empty entire cart
 * @property {Function} toggleCart - Toggle cart sidebar
 */

/**
 * Storage configuration
 */
const STORAGE = {
  CART: 'luxury_cart_v2',
};

/**
 * Load cart from localStorage with validation
 * @returns {CartItem[]} Validated cart items or empty array
 */
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem(STORAGE.CART);
    if (!cartData) return [];
    
    const cart = JSON.parse(cartData);
    
    // Validate cart structure
    return Array.isArray(cart) 
      ? cart.filter(item => 
          item.id && 
          typeof item.price === 'number' && 
          Number.isFinite(item.price) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
        )
      : [];
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
};

/**
 * Save cart to localStorage with debouncing
 * @param {CartItem[]} cartItems 
 */
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(STORAGE.CART, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

/**
 * Cart Context Provider - Production Ready
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage());
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auto-save to localStorage whenever cart changes (debounced via useEffect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCartToStorage(cartItems);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [cartItems]);

  // Memoized calculations - lightning fast
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }, [cartItems]);

  /**
   * Add item to cart with duplicate prevention logic
   * @param {CartItem} product - Product to add
   * @param {number} [quantity=1] - Quantity to add
   */
  const addItemToCart = useCallback((product, quantity = 1) => {
    if (!product.id || !Number.isFinite(product.price) || quantity <= 0) {
      toast.error('Invalid product data');
      return;
    }

    setCartItems((prevItems) => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        toast.success(`${product.name} quantity updated`);
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name || 'Product',
          image: product.image || '',
          price: Number(product.price),
          quantity
        };
        
        toast.success(`${product.name} added to cart`);
        return [...prevItems, newItem];
      }
    });
  }, []);

  /**
   * Remove item from cart by ID
   * @param {string} productId - Product ID to remove
   */
  const removeItemFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      toast.success('Item removed from cart');
      return updatedItems;
    });
  }, []);

  /**
   * Update item quantity precisely
   * @param {string} productId - Product ID
   * @param {number} newQuantity - New quantity (must be >= 0)
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 0) return;

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ).filter(item => item.quantity > 0); // Remove if quantity becomes 0

      if (updatedItems.length !== prevItems.length) {
        toast.success('Item removed (quantity reached 0)');
      }
      
      return updatedItems;
    });
  }, []);

  /**
   * Clear entire cart (post-checkout)
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    setIsCartOpen(false);
    toast.success('Order completed! Cart cleared.');
  }, []);

  /**
   * Toggle cart sidebar visibility
   */
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  // Fully memoized context value - PERFORMANCE CRITICAL
  const contextValue = useMemo(() => ({
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  }), [
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.displayName = 'CartProvider';

/**
 * Custom hook for consuming cart context
 * @returns {CartContextType}
 * @throws {Error} When used outside CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart Context (internal)
 */
const CartContext = createContext(undefined);

export default CartContext;
