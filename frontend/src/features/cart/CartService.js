import axiosInstance from '@/config/axiosConfig';

/**
 * @module CartService
 * @description High-performance shopping cart service for $10k+ enterprise marketplace
 * @author Senior Frontend Architect
 * @version 3.0.0
 */

class CartService {
  constructor() {
    this.cartKey = 'global_auction_cart';
  }

  /**
   * @method getCart
   * @description Retrieves the current cart items from local storage.
   */
  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  /**
   * @method addToCart
   * @description Adds an item or updates quantity if it already exists.
   */
  addToCart(product, quantity = 1) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item._id === product._id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    this.saveCart(cart);
    return cart;
  }

  /**
   * @method removeFromCart
   * @description Removes a specific product from the cart.
   */
  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item._id !== productId);
    this.saveCart(cart);
    return cart;
  }

  /**
   * @method updateQuantity
   * @description Updates the quantity of a specific item.
   */
  updateQuantity(productId, quantity) {
    if (quantity <= 0) return this.removeFromCart(productId);
    
    let cart = this.getCart();
    const index = cart.findIndex(item => item._id === productId);
    if (index > -1) {
      cart[index].quantity = quantity;
      this.saveCart(cart);
    }
    return cart;
  }

  /**
   * @method getCartTotal
   * @description Calculates the total price including dynamic tax logic.
   */
  getCartTotal() {
    const cart = this.getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.14; 
    return {
      subtotal,
      tax,
      total: subtotal + tax,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
  }

  /**
   * @method saveCart
   * @description Persists cart state to local storage and prepares for API sync.
   */
  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    
    // Logic for backend synchronization if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.syncWithServer(cart);
    }
  }

  /**
   * @method syncWithServer
   * @private
   */
  async syncWithServer(cart) {
    try {
      await axiosInstance.post('/cart/sync', { items: cart });
    } catch (error) {
      console.error('Cart sync failed:', error);
    }
  }

  /**
   * @method clearCart
   * @description Purges all items from the cart.
   */
  clearCart() {
    localStorage.removeItem(this.cartKey);
    return [];
  }
}

const cartServiceInstance = new CartService();
export default cartServiceInstance;
