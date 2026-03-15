/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'], // Class-based dark mode (enterprise standard)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ========================================
      // LUXURY COLOR PALETTE ($10k+ Aesthetic)
      // ========================================
      colors: {
        // Primary Gold Scale (Luxury Investment Theme)
        gold: {
          50: '#fef7e8',   // Champagne mist
          100: '#fdebc5',  // Light gold
          200: '#f9d98a',  // Soft gold
          300: '#f4c550',  // Warm gold
          400: '#e8af37',  // Rich gold
          500: '#d4af37',  // Hero gold (Primary CTA)
          600: '#b8942e',  // Deep gold
          700: '#927529',  // Burnished gold
          800: '#755d21',  // Antique gold
          900: '#58451a',  // Dark bronze
          950: '#3b2e12',  // Matte bronze
        },

        // Cinematic Dark Palette
        dark: {
          950: '#020202',  // Pure void
          900: '#0a0a0a',  // Deep space
          800: '#111111',  // Nightfall
          700: '#1a1a1a',  // Charcoal
          600: '#262626',  // Slate dark
          500: '#333333',  // Base dark
        },

        // Luxury Accents
        accent: {
          emerald: '#10b981',    // Trust signals
          sapphire: '#0ea5e9',   // CTAs
          amethyst: '#8b5cf6',   // Premium features
          ruby: '#ef4444',       // Alerts
        },

        // Glassmorphism Neutrals
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
        },
      },

      // ========================================
      // TYPOGRAPHY (Luxury Hierarchy)
      // ========================================
      fontFamily: {
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],     // Headings
        'sans': ['"Inter"', '"SF Pro Display"', '-apple-system', 'sans-serif'], // UI
        'mono': ['"JetBrains Mono"', 'Monaco', 'monospace'],     // Code
      },

      // ========================================
      // SPACING (Generous & Elegant)
      // ========================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },

      // ========================================
      // BORDER RADIUS (Sophisticated)
      // ========================================
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        'glass': '2rem',
        'lux': '3rem',
      },

      // ========================================
      // SHADOWS (Cinematic Depth)
      // ========================================
      boxShadow: {
        'lux-sm': '0 10px 30px -10px rgba(212, 175, 55, 0.3)',
        'lux': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'lux-glow': '0 0 0 1px rgba(212, 175, 55, 0.5), 0 10px 30px rgba(212, 175, 55, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },

      // ========================================
      // ANIMATIONS (Cinema-Grade)
      // ========================================
      animation: {
        'gold-shimmer': 'goldShimmer 2s infinite',
        'slow-fade': 'slowFade 1.5s ease-in-out',
        'lux-pulse': 'luxPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },

      // Custom Keyframes
      keyframes: {
        goldShimmer: {
          '0%, 100%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        slowFade: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        luxPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0px rgba(212, 175, 55, 0.7)' },
          '50%': { boxShadow: '0 0 0 20px rgba(212, 175, 55, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },

      // ========================================
      // TRANSITIONS (Smooth Everywhere)
      // ========================================
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },

      // ========================================
      // GRADIENTS (Luxury Shine)
      // ========================================
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f4c550 50%, #e8af37 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #111111 100%)',
        'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },

      // ========================================
      // RESPONSIVE BREAKPOINTS (Luxury Spacing)
      // ========================================
      screens: {
        'xs': '475px',
        'lux': '1440px',
      },
    },
  },
  plugins: [
    // Cinematic Animations
    require('tailwindcss-animate'),
    
    // Typography (Blog/Markdown)
    require('@tailwindcss/typography'),
    
    // Forms (Native Input Styling)
    require('@tailwindcss/forms'),
  ],
}
