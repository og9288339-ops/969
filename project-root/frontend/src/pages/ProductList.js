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
    <div className="content">
      <h1 style={{ marginBottom: '1.5rem' }}>Explore Products</h1>
      
      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      
      <div className="grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
            No products found matching your criteria.
          </p>
        )}
      </div>

      {pagination && products.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => fetchProducts({ page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="btn"
            style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          
          <span style={{ fontWeight: '500' }}>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          
          <button
            onClick={() => fetchProducts({ page: pagination.page + 1 })}
            disabled={pagination.page * pagination.limit >= pagination.total}
            className="btn"
            style={{ opacity: (pagination.page * pagination.limit >= pagination.total) ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
