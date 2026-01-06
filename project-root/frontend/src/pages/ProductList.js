import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/products?${query}`);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleSearch = (term) => {
    fetchProducts({ search: term });
  };

  const handleFilter = (filters) => {
    fetchProducts(filters);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {pagination && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => fetchProducts({ page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="btn"
          >
            Previous
          </button>
          <span style={{ margin: '0 1rem' }}>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => fetchProducts({ page: pagination.page + 1 })}
            disabled={pagination.page * pagination.limit >= pagination.total}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;