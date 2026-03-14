import axiosInstance from '@/config/axiosConfig';

/**
 * @module AuthService
 * @description Cinema-grade authentication service for $10k+ enterprise marketplace
 * @author Senior Security & Full-Stack Architect
 * @version 3.0.0
 */

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
  }

  /**
   * @method login
   * @description Authenticates user and initializes session.
   */
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.data.token) {
        this.setSession(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @method register
   * @description Creates a new premium user account.
   */
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @method logout
   * @description Terminates the session and purges local security data.
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/login';
  }

  /**
   * @method setSession
   * @description Persists authentication data securely.
   */
  setSession(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * @method getToken
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * @method getCurrentUser
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * @method isAuthenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * @method handleError
   * @description Normalizes backend errors into user-friendly messages.
   */
  handleError(error) {
    const message = error.response?.data?.message || 'A secure connection error occurred.';
    return new Error(message);
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
