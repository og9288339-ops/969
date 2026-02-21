import React, { useState } from 'react';
import { debounce } from '../utils/helpers';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const debouncedSearch = debounce((term) => {
    onSearch(term);
  }, 300);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleFilterChange = () => {
    onFilter({ category, priceRange });
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3>Search & Filter</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
        />
        <button onClick={handleFilterChange} className="btn">Apply Filters</button>
      </div>
    </div>
  );
};

export default SearchFilter;
