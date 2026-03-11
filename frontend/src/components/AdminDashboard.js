import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Menu,
  X,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dashboard Data State
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    activeOrders: 0,
    revenue: 0,
  });

  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, productsRes, salesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/products'),
          fetch('/api/admin/sales-data'),
        ]);

        if (!statsRes.ok || !productsRes.ok || !salesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsRes.json();
        const productsData = await productsRes.json();
        const salesData = await salesRes.json();

        setStats(statsData);
        setProducts(productsData);
        setSalesData(salesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="stat-card skeleton">
      <div className="skeleton-icon"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-value"></div>
        <div className="skeleton-chart"></div>
      </div>
    </div>
  );

  // Skeleton Table Row
  const SkeletonTableRow = () => (
    <tr className="skeleton-row">
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell"></div></td>
    </tr>
  );

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle Delete Product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  // Handle Edit Product
  const handleEdit = (product) => {
    console.log('Edit product:', product);
  };

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">969 Admin</span>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-links">
            <li className="nav-item active">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </li>
            <li className="nav-item">
              <Package size={20} />
              <span>Products</span>
            </li>
            <li className="nav-item">
              <Users size={20} />
              <span>Users</span>
            </li>
            <li className="nav-item">
              <ShoppingCart size={20} />
              <span>Orders</span>
            </li>
            <li className="nav-item">
              <DollarSign size={20} />
              <span>Revenue</span>
            </li>
            <li className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <Bell size={20} />
            <span>Notifications</span>
          </button>
          <button className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="top-actions">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-profile">
              <div className="avatar">A</div>
              <span className="username">Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <section className="stats-section">
            <h2 className="section-title">Overview</h2>
            <div className="stats-grid">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <StatCard
                    title="Total Sales"
                    value={stats.totalSales}
                    icon={<ShoppingCart />}
                    trend="+12.5%"
                    isPositive={true}
                  />
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users />}
                    trend="+8.3%"
                    isPositive={true}
                  />
                  <StatCard
                    title="Active Orders"
                    value={stats.activeOrders}
                    icon={<Package />}
                    trend="-2.1%"
                    isPositive={false}
                  />
                  <StatCard
                    title="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={<DollarSign />}
                    trend="+15.7%"
                    isPositive={true}
                  />
                </>
              )}
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-section">
            <h2 className="section-title">Sales Overview</h2>
            <div className="chart-container">
              {loading ? (
                <div className="chart-skeleton">
                  <div className="skeleton-chart-large"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* Products Table */}
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">Product Management</h2>
              <div className="table-actions">
                <button className="filter-btn">
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
                <button className="add-btn">
                  <span>+ Add Product</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              {loading ? (
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonTableRow key={index} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-cell">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                              />
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>${product.price}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                product.stock > 0 ? 'in-stock' : 'out-of-stock'
                              }`}
                            >
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, trend, isPositive }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-trend">
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{trend}</span>
      </div>
    </div>
    <div className="sparkline">
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={Array.from({ length: 10 }, (_, i) => ({
          value: Math.random() * 100,
        }))}>
          <Area
            type="monotone"
            dataKey="
