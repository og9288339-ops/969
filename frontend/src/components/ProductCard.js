import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = memo(({ 
  id, 
  image, 
  title, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  description, 
  isNew = false, 
  isOnSale = false,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist && onToggleWishlist(id);
  };

  const handleAddToCart = () => {
    onAddToCart && onAddToCart(id);
  };

  const ratingStars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={index < Math.floor(rating) ? "filled" : "empty"}
    />
  ));

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Zoom Effect */}
      <div className="product-image-container">
        <motion.img
          src={image}
          alt={title}
          className="product-image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
        />
        
        {/* Badges */}
        {isNew && (
          <span className="badge badge-new">New</span>
        )}
        {isOnSale && (
          <span className="badge badge-sale">Sale</span>
        )}

        {/* Wishlist Button */}
        <motion.button
          className="wishlist-btn"
          onClick={handleWishlistToggle}
          whileTap={{ scale: 0.9 }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={isWishlisted ? "heart-filled" : "heart-outline"}
          />
        </motion.button>

        {/* Quick Add Button */}
        <motion.button
          className="quick-add-btn"
          onClick={handleAddToCart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.2 }}
          aria-label="Add to cart"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </motion.button>
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        
        {/* Rating */}
        <div className="product-rating">
          <div className="stars">{ratingStars}</div>
          <span className="rating-text">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="product-description">{description}</p>

        {/* Price with Glassmorphism */}
        <div className="product-price-container">
          <span className="price-current">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="price-original">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
