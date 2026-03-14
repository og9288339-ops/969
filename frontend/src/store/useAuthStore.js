import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authServiceInstance from '@/services/authService';

/**
 * @module useAuthStore
 * @description Enterprise-grade Zustand auth store ($10k+ luxury marketplace)
 * @author Senior Frontend Architect & UI Engineer
 * @version 3.0.0
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,
      lastHandshake: null,
      sessionStatus: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

      // --- ACTIONS ---

      /**
       * @action loginUser
       * @description Executes luxury handshake protocol and updates global state.
       */
      loginUser: async (credentials) => {
        set({ isLoading: true, authError: null, sessionStatus: 'loading' });
        try {
          const { user, token } = await authServiceInstance.login(credentials);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            sessionStatus: 'authenticated',
            lastHandshake: new Date().toISOString()
          });
        } catch (error) {
          set({ 
            authError: error.message, 
            isLoading: false, 
            isAuthenticated: false,
            sessionStatus: 'unauthenticated'
          });
          throw error;
        }
      },

      /**
       * @action registerUser
       * @description Onboards new elite members into the ecosystem.
       */
      registerUser: async (userData) => {
        set({ isLoading: true, authError: null });
        try {
          const response = await authServiceInstance.register(userData);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ authError: error.message, isLoading: false });
          throw error;
        }
      },

      /**
       * @action logoutUser
       * @description Gracefully terminates sessions and purges persistent storage.
       */
      logoutUser: () => {
        authServiceInstance.logout();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          authError: null,
          sessionStatus: 'unauthenticated',
          lastHandshake: null
        });
      },

      /**
       * @action checkAuth
       * @description High-protocol integrity check on application bootstrap.
       */
      checkAuth: () => {
        const user = authServiceInstance.getCurrentUser();
        const token = authServiceInstance.getToken();
        
        if (user && token) {
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            sessionStatus: 'authenticated' 
          });
        } else {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            sessionStatus: 'unauthenticated' 
          });
        }
      },

      /**
       * @action updateProfile
       * @description Synchronizes local state with updated member credentials.
       */
      updateProfile: (updatedData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null
        }));
      },

      /**
       * @action clearErrors
       * @description Purges any authentication exception logs from the store.
       */
      clearErrors: () => set({ authError: null })
    }),
    {
      name: 'luxury_vault_session',
      storage: createJSONStorage(() => localStorage),
      // Selective Persistence: Only store data required for session restoration
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
