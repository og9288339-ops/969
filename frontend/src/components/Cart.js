import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  X, 
  Minus, 
  Plus, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  Gift,
  ArrowLeft,
  Shield
} from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/120x120/1a1a1a/ffffff?text=Watch',
      name: 'Luxe Chronograph Watch',
      options: { size: '42mm', color: 'Black' },
      price: 1299.99,
      quantity: 1,
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/120x120/1a1a1a/ffffff?text=Bag',
      name: 'Designer Leather Tote',
      options: { size: 'Medium', color: 'Cognac' },
      price: 899.50,
      quantity: 2,
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/120x120/1a1a1a/ffffff?text=Rings',
      name: 'Diamond Eternity Ring',
      options: { size: '7', material: '18K Gold' },
      price: 2499.00,
      quantity: 1,
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const shipping = useMemo(() => {
    return cartItems.length > 0 ? 29.99 : 0;
  }, [cartItems.length]);

  const total = useMemo(() => {
    return subtotal + shipping - (promoApplied ? subtotal * 0.1 : 0);
  }, [subtotal, shipping, promoApplied]);

  // Update quantity
  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  // Remove item
  const removeItem = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'luxury10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  // Continue shopping
  const continueShopping = () => {
    // Navigate to products page
    window.history.back();
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    // Navigate to checkout
    console.log('Proceed to checkout');
  };

  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <motion.header className="cart-header">
          <button className="back-btn" onClick={continueShopping}>
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <h1 className="cart-title">
            <ShoppingBag size={28} />
            Your Cart
          </h1>
        </motion.header>

        {/* Main Content */}
        <div className="cart-main">
          {/* Cart Items */}
          <AnimatePresence>
            {isEmpty ? (
              <motion.div
                key="empty"
                className="cart-empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="empty-icon">
                  <ShoppingBag size={64} />
                </div>
                <h2>Your cart is empty</h2>
                <p>Discover our luxury collection and add items to your cart.</p>
                <button className="continue-btn" onClick={continueShopping}>
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <LayoutGroup key="items">
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="item-details">
                        <div className="item-header">
                          <h3 className="item-name">{item.name}</h3>
                          <button 
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="item-options">
                          {Object.entries(item.options).map(([key, value]) => (
                            <span key={key} className="option-tag">
                              {key}: {value}
                            </span>
                          ))}
                        </div>

                        <div className="item-price-section">
                          <span className="item-price">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <div className="quantity-selector">
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </LayoutGroup>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {!isEmpty && (
          <motion.aside 
            className="order-summary"
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <div className="summary-label">
                  <Truck size={16} />
                  <span>Shipping</span>
                </div>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="promo-section">
                <div className="promo-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <button 
                    className="promo-btn"
                    onClick={applyPromo}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="promo-success">
                    <Gift size={16} />
                    <span>10% discount applied!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="total-section">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">${total.toLocaleString()}</span>
              </div>
            </div>

            <motion.button
              className="checkout-btn"
              onClick={proceedToCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>

            <div className="payment-methods">
              <span className="payment-label">We accept</span>
              <div className="payment-icons">
                <div className="payment-icon">
                  <CreditCard />
                </div>
                <div className="payment-icon">
                  <CreditCard />
                </div>
                <div className="payment-icon paypal">
                  PayPal
                </div>
                <div className="payment-icon">
                  <CreditCard />
                </div>
              </div>
            </div>

            <div className="trust-badge">
              <Shield size={16} />
              <span>Secure Checkout | 256-bit SSL</span>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
