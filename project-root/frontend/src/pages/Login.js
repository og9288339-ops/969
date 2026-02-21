import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" className="btn" style={{ width: '100%', padding: '0.8rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
