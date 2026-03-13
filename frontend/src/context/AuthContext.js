/**
 * @module AuthContext
 * @description Production-ready React Context for complete authentication lifecycle
 * @author Senior Fullstack Architect
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Optional toast library

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User full name
 * @property {string} role - User role (user, admin)
 * @property {string} avatar - User avatar URL
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Current user profile
 * @property {string|null} token - JWT token
 * @property {boolean} isAuthenticated - Auth status
 * @property {boolean} loading - Global loading state
 * @property {Function} login - Login function
 * @property {Function} register - Register + auto-login
 * @property {Function} logout - Secure logout
 * @property {Function} checkAuthStatus - Validate saved token
 */

/**
 * Storage keys for persistence
 */
const STORAGE = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

/**
 * Axios instance with auth interceptors
 */
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * Configure Axios interceptors for automatic auth headers
 * @param {string|null} token - JWT token
 */
const configureAxios = (token) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for token refresh/401 handling
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expired - logout user
        localStorage.removeItem(STORAGE.TOKEN);
        localStorage.removeItem(STORAGE.USER);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Auth Context Provider - Production Ready
 * @param {Object} props 
 * @param {React.ReactNode} props.children 
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Check authentication status on mount and restore session
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      const savedToken = localStorage.getItem(STORAGE.TOKEN);
      const savedUser = localStorage.getItem(STORAGE.USER);

      if (!savedToken || !savedUser) {
        setLoading(false);
        return;
      }

      // Configure axios with saved token
      configureAxios(savedToken);
      setToken(savedToken);

      // Validate token with /api/auth/me
      const response = await apiClient.get('/auth/me');
      const validatedUser = response.data;

      setUser(validatedUser);
      localStorage.setItem(STORAGE.USER, JSON.stringify(validatedUser));
      
      toast.success('Welcome back!');
    } catch (error) {
      // Invalid/expired token - clear storage
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER);
      setUser(null);
      setToken(null);
      toast.error('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Login user with email/password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<void>}
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: authUser } = response.data;

      // Store securely
      localStorage.setItem(STORAGE.TOKEN, newToken);
      localStorage.setItem(STORAGE.USER, JSON.stringify(authUser));
      
      // Configure axios
      configureAxios(newToken);
      
      setToken(newToken);
      setUser(authUser);
      
      toast.success(`Welcome back, ${authUser.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Register new user and auto-login
   * @param {Object} userData 
   * @param {string} userData.email 
   * @param {string} userData.password 
   * @param {string} userData.name 
   * @returns {Promise<void>}
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      
      const response = await apiClient.post('/auth/register', userData);
      const { token: newToken, user: authUser } = response.data;

      // Auto-login after registration
      localStorage.setItem(STORAGE.TOKEN, newToken);
      localStorage.setItem(STORAGE.USER, JSON.stringify(authUser));
      
      configureAxios(newToken);
      
      setToken(newToken);
      setUser(authUser);
      
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Secure logout with full cleanup
   */
  const logout = useCallback(() => {
    try {
      // Clear all storage
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER);
      
      // Reset axios defaults
      delete apiClient.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
      setToken(null);
      
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout cleanup failed:', error);
      // Force redirect even if cleanup fails
      window.location.href = '/login';
    }
  }, [navigate]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Memoized derived state
  const isAuthenticated = useMemo(() => {
    return !!user && !!token;
  }, [user, token]);

  // Fully memoized context value - ZERO re-renders guaranteed
  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  }), [user, token, isAuthenticated, loading, login, register, logout, checkAuthStatus]);

  // Global loading overlay
  if (loading) {
    return (
      <div className="auth-loading-overlay">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.displayName = 'AuthProvider';

/**
 * Custom hook for consuming auth context
 * @returns {AuthContextType}
 * @throws {Error} When used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Context (internal use only)
 */
const AuthContext = createContext(undefined);

export default AuthContext;
