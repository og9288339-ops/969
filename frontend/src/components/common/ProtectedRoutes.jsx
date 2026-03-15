/**
 * @module ProtectedRoute
 * @description Enterprise-grade route protection with RBAC ($10k+ marketplace)
 * @author Senior Full-Stack Architect
 * @version 2.1.0
 * @since 2024
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore.js';
import Loader from '@/components/common/Loader.jsx';

/**
 * Protects routes based on authentication and role-based access control
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Content to render when authorized
 * @param {string[]} [props.allowedRoles] - Array of permitted roles (e.g., ['admin', 'seller'])
 * @returns {JSX.Element} Protected content or redirect
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsAuthChecked(true);
    };

    initializeAuth();
  }, [checkAuth]);

  // Handle auth state changes
  useEffect(() => {
    if (!isAuthChecked || isLoading) return;

    // No authentication → redirect to login with return URL
    if (!isAuthenticated) {
      const redirectPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, {
        replace: true,
      });
      return;
    }

    // Role-based access control
    if (allowedRoles.length > 0 && user?.roles) {
      const hasRequiredRole = allowedRoles.some(role => 
        user.roles.includes(role)
      );

      if (!hasRequiredRole) {
        // Save attempted URL for later access
        navigate('/unauthorized', {
          state: { from: location.pathname + location.search },
          replace: true,
        });
        return;
      }
    }

    // Authorized → render children
  }, [isAuthenticated, user, allowedRoles, isAuthChecked, isLoading, navigate, location]);

  // Loading state while checking auth
  if (!isAuthChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <Loader 
          size="lg" 
          fullScreen 
          text="Validating secure access..." 
        />
      </div>
    );
  }

  // Authorized → render protected content
  return children ? children : <Outlet />;
};

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
