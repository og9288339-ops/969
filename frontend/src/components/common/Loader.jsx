/**
 * @module Loader
 * @description Cinema-grade loading component for $10k+ enterprise marketplace
 * @author Senior Frontend Developer (Creative UI)
 * @version 2.0.0
 * @since 2024
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  Sparkles 
} from 'lucide-react';

/**
 * Luxury loading states for enterprise applications
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Loader size
 * @param {boolean} [props.fullScreen=false] - Full viewport overlay
 * @param {string} [props.text] - Optional loading text
 * @param {string} [props.className] - Additional Tailwind classes
 * @returns {JSX.Element}
 */
const Loader = ({
  size = 'md',
  fullScreen = false,
  text,
  className = '',
}) => {
  // Size variants for responsive luxury design
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    full: 'w-24 h-24',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  // Cinema-grade animation variants (60FPS GPU accelerated)
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Luxury gold/black glassmorphism theme
  const themeClasses = `
    bg-gradient-to-br from-gold/10 via-black/50 to-slate-900/80
    backdrop-blur-xl border border-gold/20
    shadow-2xl shadow-gold/10
  `;

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        aria-label="Loading marketplace content"
        role="status"
      >
        <motion.div
          className={`
            ${themeClasses}
            p-8 rounded-3xl flex flex-col items-center gap-6
            max-w-sm mx-4
          `}
          variants={pulseVariants}
          animate="animate"
        >
          {/* Luxury Spinner */}
          <motion.div
            className={`
              ${spinnerSize} relative
              bg-gradient-to-r from-gold via-yellow-400 to-orange-500
              rounded-2xl p-2 shadow-xl shadow-gold/25
            `}
            variants={spinnerVariants}
            animate="animate"
          >
            <Loader2 
              className="w-full h-full text-slate-900 drop-shadow-lg"
            />
          </motion.div>

          {/* Sparkle Effect */}
          <Sparkles className="w-8 h-8 text-gold/70 animate-pulse" />

          {/* Premium Typography */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
              Loading Luxury
            </h2>
            {text && (
              <p className="text-slate-400 text-sm font-medium tracking-wide">
                {text}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Inline Loader (buttons, cards, lists)
  return (
    <div 
      className={`
        ${className}
        inline-flex items-center gap-2
        ${fullScreen ? '' : 'p-2 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50'}
      `}
      aria-label="Loading"
      role="status"
    >
      <motion.div
        className={`
          ${spinnerSize}
          bg-gradient-to-r from-gold via-yellow-400 to-orange-500
          rounded-xl p-1.5 shadow-lg shadow-gold/30
        `}
        variants={spinnerVariants}
        animate="animate"
      >
        <Loader2 
          className="w-full h-full text-slate-900/90 drop-shadow-md"
        />
      </motion.div>
      
      {text && (
        <motion.span
          className="text-sm font-medium text-slate-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

Loader.displayName = 'Loader';

export default Loader;
