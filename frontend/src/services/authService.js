import axiosInstance from '@/config/axiosConfig';
import { jwtDecode } from 'jwt-decode';

/**
 * @module AuthService
 * @description Enterprise-grade authentication service ($10k+ luxury marketplace)
 * @author Senior Cyber-Security Engineer & Full-Stack Architect
 * @version 3.0.0
 */

class AuthService {
  constructor() {
    this.tokenKey = 'auth_portal_token';
    this.init();
  }

  /**
   * @method init
   * @description Initializes the service and restores session headers.
   */
  init() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.setAuthHeader(token);
    }
  }

  /**
   * @method login
   * @description Secures a session and initializes the neural handshake.
   */
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(this.tokenKey, token);
        this.setAuthHeader(token);
      }
      return { token, user };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * @method register
   * @description Protocol for onboarding new elite members.
   */
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * @method logout
   * @description Terminates the session and purges local credentials.
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.setAuthHeader(null);
    window.location.href = '/login';
  }

  /**
   * @method getCurrentUser
   * @description Decodes the JWT to retrieve member identity and access tier.
   */
  getCurrentUser() {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      
      // Security Check: Token Expiration Protocol
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.logout();
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error("Session Corruption Detected:", error);
      return null;
    }
  }

  /**
   * @method isAuthenticated
   * @description Boolean check for route guarding and VIP access.
   */
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }

  /**
   * @method getToken
   * @description Retrieves the current active session token.
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * @private
   * @method setAuthHeader
   * @description Attaches the bearer token to the global axios protocol.
   */
  setAuthHeader(token) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  /**
   * @private
   * @method handleAuthError
   * @description Normalizes security and network errors.
   */
  handleAuthError(error) {
    const message = error.response?.data?.message || 'Authentication protocol failed. Neural link unstable.';
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      this.logout();
    }

    return new Error(message);
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
