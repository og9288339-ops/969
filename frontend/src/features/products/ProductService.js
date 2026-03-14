import axiosInstance from '@/config/axiosConfig';

/**
 * @module ProductService
 * @description Enterprise-grade product repository ($10k+ luxury marketplace)
 * @author Senior Frontend Architect
 * @version 3.0.0
 */

class ProductService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5-minute memory cache
  }

  /**
   * @method getAllProducts
   * @description Fetches products with advanced filtering and pagination.
   */
  async getAllProducts(filters = {}) {
    const cacheKey = `products_${JSON.stringify(filters)}`;
    if (this.isCacheValid(cacheKey)) return this.cache.get(cacheKey).data;

    try {
      const response = await axiosInstance.get('/products', { params: filters });
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @method getProductById
   * @description Retrieves a single luxury asset by its unique identifier.
   */
  async getProductById(id) {
    if (this.isCacheValid(id)) return this.cache.get(id).data;

    try {
      const response = await axiosInstance.get(`/products/${id}`);
      this.setCache(id, response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @method getFeaturedProducts
   * @description Fetches curated top-tier assets for the hero sections.
   */
  async getFeaturedProducts() {
    return this.getAllProducts({ featured: true, limit: 12 });
  }

  /**
   * @method searchProducts
   * @description Real-time optimized search for specific marketplace assets.
   */
  async searchProducts(query) {
    try {
      const response = await axiosInstance.get('/products/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @method getCategories
   * @description Retrieves all product categories for navigation.
   */
  async getCategories() {
    const cacheKey = 'product_categories';
    if (this.isCacheValid(cacheKey)) return this.cache.get(cacheKey).data;

    try {
      const response = await axiosInstance.get('/products/categories');
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * @private
   * @method isCacheValid
   */
  isCacheValid(key) {
    if (!this.cache.has(key)) return false;
    const { timestamp } = this.cache.get(key);
    return Date.now() - timestamp < this.cacheDuration;
  }

  /**
   * @private
   * @method setCache
   */
  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * @method clearCache
   * @description Purges memory to ensure fresh data fetching.
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * @method handleError
   * @description Normalizes data fetching errors for a premium UI.
   */
  handleError(error) {
    const message = error.response?.data?.message || 'Failed to sync with marketplace inventory. Neural link unstable.';
    return new Error(message);
  }
}

const productServiceInstance = new ProductService();
export default productServiceInstance;
