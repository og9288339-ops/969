import axiosInstance from '@/config/axiosConfig';

/**
 * @module ProductService
 * @description Enterprise-grade product management service ($10k+ luxury marketplace)
 * @author Principal Software Engineer
 * @version 4.0.0
 */

class ProductService {
  constructor() {
    this.cache = new Map();
    this.CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in-memory cache
  }

  /**
   * @method fetchProducts
   * @description Retrieves a curated list of luxury assets with advanced filtering.
   * @param {Object} params - Query parameters (page, limit, category, sort, search).
   */
  async fetchProducts(params = {}) {
    const cacheKey = `products_${JSON.stringify(params)}`;
    
    if (this._isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const response = await axiosInstance.get('/products', { params });
      const normalizedData = this._normalizeResponse(response.data);
      
      this._setCache(cacheKey, normalizedData);
      return normalizedData;
    } catch (error) {
      throw this._handleServiceError(error);
    }
  }

  /**
   * @method fetchProductBySlug
   * @description Retrieves a single asset by its SEO-friendly slug.
   */
  async fetchProductBySlug(slug) {
    if (this._isCacheValid(slug)) return this.cache.get(slug).data;

    try {
      const response = await axiosInstance.get(`/products/slug/${slug}`);
      const data = response.data;
      this._setCache(slug, data);
      return data;
    } catch (error) {
      throw this._handleServiceError(error);
    }
  }

  /**
   * @method fetchProductById
   * @description Direct database lookup by unique identifier.
   */
  async fetchProductById(id) {
    if (this._isCacheValid(id)) return this.cache.get(id).data;

    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const data = response.data;
      this._setCache(id, data);
      return data;
    } catch (error) {
      throw this._handleServiceError(error);
    }
  }

  /**
   * @method getFeaturedAssets
   * @description Highly optimized fetch for landing page luxury showcases.
   */
  async getFeaturedAssets() {
    return this.fetchProducts({ featured: true, limit: 12, sort: 'exclusive' });
  }

  /**
   * @method searchAssets
   * @description Real-time search protocol for high-value inventory.
   */
  async searchAssets(query) {
    try {
      const response = await axiosInstance.get('/products/search', { params: { q: query } });
      return this._normalizeResponse(response.data);
    } catch (error) {
      throw this._handleServiceError(error);
    }
  }

  /**
   * @private
   * @method _normalizeResponse
   */
  _normalizeResponse(data) {
    if (!data) return [];
    const items = data.products || data;
    
    return (Array.isArray(items) ? items : [items]).map(item => ({
      ...item,
      id: item._id || item.id,
      price: item.price || 0,
      images: item.images?.length ? item.images : ['/placeholder-luxury.jpg'],
      status: item.status || 'Active',
      valuationTrend: item.valuationTrend || 'Stable'
    }));
  }

  /**
   * @private
   * @method _isCacheValid
   */
  _isCacheValid(key) {
    if (!this.cache.has(key)) return false;
    const { timestamp } = this.cache.get(key);
    return Date.now() - timestamp < this.CACHE_EXPIRATION;
  }

  /**
   * @private
   * @method _setCache
   */
  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * @method purgeCache
   * @description Clears the memory handshake for a fresh data sync.
   */
  purgeCache() {
    this.cache.clear();
  }

  /**
   * @private
   * @method _handleServiceError
   */
  _handleServiceError(error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Neural link with inventory failed. Protocol error.';

    const serviceError = new Error(message);
    serviceError.status = status;
    serviceError.isNetworkError = !error.response;

    return serviceError;
  }
}

const productServiceInstance = new ProductService();
export default productServiceInstance;
