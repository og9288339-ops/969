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
      setFormData({ name: '', description: '', price: '', category: '', stock: '', images: [] });
    } catch (error) {
      console.error('Error saving product:', error);
    }
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
    if (!formData.name || !formData.category) return;
    const description = await generateDescription(formData.name, formData.category, []);
    if (description) {
      setFormData({ ...formData, description });
    }
  };

  const handleAIPricing = async () => {
    if (!formData.name || !formData.category) return;
    const suggestion = await getPricingSuggestion(formData.name, formData.category, 'market data');
    if (suggestion) {
      alert(`AI Pricing Suggestion: ${suggestion}`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <h2>Product Management</h2>
      <button onClick={() => setShowForm(!showForm)} className="btn">
        {showForm ? 'Cancel' : 'Add New Product'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Name</label>
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
            />
            <button type="button" onClick={handleAIGenerateDescription} disabled={aiLoading}>
              {aiLoading ? 'Generating...' : 'AI Generate Description'}
            </button>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <button type="button" onClick={handleAIPricing} disabled={aiLoading}>
              {aiLoading ? 'Getting...' : 'AI Pricing Suggestion'}
            </button>
          </div>
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
          <button type="submit" className="btn">{formData._id ? 'Update' : 'Create'} Product</button>
        </form>
      )}
      <div className="grid" style={{ marginTop: '2rem' }}>
        {products.map((product) => (
          <div key={product._id} className="card">
            <h3>{product.name}</h3>
            <p>{formatCurrency(product.price)}</p>
            <p>Stock: {product.stock}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(product)} className="btn">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;