import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAI } from '../hooks/useAI';
import { formatCurrency } from '../utils/helpers';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  });
  const { generateDescription, getPricingSuggestion, loading: aiLoading } = useAI();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/products/${formData._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', stock: '', images: [] });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setShowForm(true);
  };

  const handleAIGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert('Please enter product name and category first.');
      return;
    }
    const description = await generateDescription(formData.name, formData.category, []);
    if (description) {
      setFormData({ ...formData, description });
    }
  };

  const handleAIPricing = async () => {
    if (!formData.name || !formData.category) {
      alert('Please enter product name and category first.');
      return;
    }
    const suggestion = await getPricingSuggestion(formData.name, formData.category, 'market data');
    if (suggestion) {
      alert(`AI Pricing Suggestion: ${suggestion}`);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Product Management</h2>
        <button onClick={() => { setShowForm(!showForm); if(showForm) resetForm(); }} className="btn">
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem', border: '1px solid #007bff' }}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
            />
            <button 
              type="button" 
              onClick={handleAIGenerateDescription} 
              disabled={aiLoading}
              style={{ marginTop: '5px', background: '#6f42c1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {aiLoading ? 'Magic is happening...' : '✨ AI Generate Description'}
            </button>
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <button 
              type="button" 
              onClick={handleAIPricing} 
              disabled={aiLoading}
              style={{ marginTop: '5px', background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              💰 AI Pricing Suggestion
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            {formData._id ? 'Update' : 'Create'} Product
          </button>
        </form>
      )}

      <div className="grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3>{product.name}</h3>
              <p style={{ color: '#007bff', fontWeight: 'bold' }}>{formatCurrency(product.price)}</p>
              <p>Stock: {product.stock}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>Category: {product.category}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => handleEdit(product)} className="btn" style={{ flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(product._id)} className="btn-danger" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
