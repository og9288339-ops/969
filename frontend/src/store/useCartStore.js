import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @module useCartStore
 * @description Enterprise-grade Zustand cart store ($10k+ luxury marketplace)
 * @author Senior Frontend Architect & UI Engineer
 * @version 3.0.0
 */

const useCartStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      cart: [],
      isCartOpen: false,
      taxRate: 0.14,
      shippingFee: 500,
      currency: 'USD',

      // --- ACTIONS ---

      /**
       * @action toggleCart
       * @description Controls the visibility of the side-vault (cart drawer).
       */
      toggleCart: (status) => set({ isCartOpen: status !== undefined ? status : !get().isCartOpen }),

      /**
       * @action addItem
       * @description Adds an asset to the cart with collision detection and quantity logic.
       */
      addItem: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === (product.id || product._id));

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === (product.id || product._id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ 
            cart: [...cart, { ...product, id: product.id || product._id, quantity: 1 }] 
          });
        }
      },

      /**
       * @action removeItem
       * @description Purges a specific asset from the acquisition list.
       */
      removeItem: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },

      /**
       * @action updateQuantity
       * @description Modifies the quantity of a specific asset within the vault.
       */
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      /**
       * @action clearCart
       * @description Resets the cart state after successful settlement or manual purge.
       */
      clearCart: () => set({ cart: [], isCartOpen: false }),

      // --- COMPUTED SELECTORS (READ-ONLY) ---

      /**
       * @method getCartStats
       * @description Real-time financial calculations for subtotal, taxes, and grand total.
       */
      getCartStats: () => {
        const { cart, taxRate, shippingFee } = get();
        
        const subtotal = cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        
        const taxTotal = subtotal * taxRate;
        const totalAmount = subtotal + taxTotal + (subtotal > 0 ? shippingFee : 0);
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

        return {
          subtotal: Number(subtotal.toFixed(2)),
          taxTotal: Number(taxTotal.toFixed(2)),
          shippingFee: subtotal > 0 ? shippingFee : 0,
          totalAmount: Number(totalAmount.toFixed(2)),
          totalItems,
        };
      },
    }),
    {
      name: 'luxury_asset_vault',
      storage: createJSONStorage(() => localStorage),
      // Selective Persistence: Maintain cart items across sessions
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;
