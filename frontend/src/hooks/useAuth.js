/**
 * @module useAuth
 * @description Premium React Hook for luxury e-commerce authentication
 * @author Senior Fullstack Architect
 * @version 1.1.0
 * @since 2024
 */

import { useMemo } from 'react';
import { toast } from 'react-hot-toast'; // Optional toast library
import { useAuth as useAuthContext } from './AuthContext'; // Your AuthContext

/**
 * @typedef {Object} AuthReturn
 * @property {Object|null} user - Current user profile
 * @property {string|null} token - JWT token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} loading - Loading state
 * @property {boolean} isAdmin - Admin privilege check
 * @property {Function} hasPermission - Role-based access control
 * @property {Function} login - Login with toast feedback
 * @property {Function} register - Register with auto-login
 * @property {Function} logout - Secure logout
 * @property {Function} checkSession - Manual token validation
 */

/**
 * Production-grade useAuth Hook - Senior Architecture
 * @returns {AuthReturn} Complete authentication interface
 */
export const useAuth = () => {
  const context = useAuthContext();

  /**
   * Check if current user is admin
   */
  const isAdmin = useMemo(() => {
    return context.user?.role === 'admin';
  }, [context.user?.role]);

  /**
   * Role-based permission check
   * @param {string|string[]} requiredRole - Required role(s)
   * @returns {boolean} Permission granted
   */
  const hasPermission = useCallback((requiredRole) => {
    if (!context.user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(context.user.role);
  }, [context.user?.role]);

  /**
   * Enhanced login with toast feedback
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<void>}
   */
  const login = useCallback(async (email, password) => {
    try {
      await context.login(email, password);
      // Toast already handled in AuthContext
    } catch (error) {
      // Context already shows error toast
      throw error;
    }
  }, [context.login]);

  /**
   * Enhanced register with success feedback
   * @param {Object} userData 
   * @returns {Promise<void>}
   */
  const register = useCallback(async (userData) => {
    try {
      await context.register(userData);
      // Context handles success toast
    } catch (error) {
      throw error;
    }
  }, [context.register]);

  /**
   * Enhanced logout with confirmation
   */
  const logout = useCallback(() => {
    if (confirm('Are you sure you want to logout?')) {
      context.logout();
    }
  }, [context.logout]);

  /**
   * Manual session/token validation
   * @returns {Promise<void>}
   */
  const checkSession = useCallback(async () => {
    try {
      toast.loading('Validating session...', { id: 'session-check' });
      await context.checkAuthStatus();
      toast.success('Session validated', { id: 'session-check' });
    } catch (error) {
      toast.error('Session validation failed', { id: 'session-check' });
      throw error;
    }
  }, [context.checkAuthStatus]);

  /**
   * Fully memoized return value - PERFORMANCE CRITICAL
   */
  return useMemo(() => ({
    // Core states
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,

    // Role-based intelligence
    isAdmin,
    hasPermission,

    // Enhanced functions
    login,
    register,
    logout,
    checkSession,
  }), [
    context.user,
    context.token,
    context.isAuthenticated,
    context.loading,
    isAdmin,
    hasPermission,
    login,
    register,
    logout,
    checkSession
  ]);
};

export default useAuth;
