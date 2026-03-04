import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import api from '../utils/api';
import { useAI } from '../hooks/useAI';

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const { getAnalyticsInsights, loading: aiLoading } = useAI();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const handleAIInsights = async () => {
    const insights = await getAnalyticsInsights(analytics);
    if (insights) {
      alert(`AI Insights: ${insights}`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const chartData = {
    labels: analytics.monthlyRevenue?.map(item => item.month) || [],
    datasets: [{
      label: 'Monthly Revenue',
      data: analytics.monthlyRevenue?.map(item => item.revenue) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="content">
      <h2>Sales Analytics</h2>
      <button onClick={handleAIInsights} disabled={aiLoading} className="btn">
        {aiLoading ? 'Generating...' : 'Get AI Insights'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Revenue Overview</h3>
          <Line data={chartData} />
        </div>
        <div className="card">
          <h3>Top Products</h3>
          <ul>
            {analytics.topProducts?.map((product, index) => (
              <li key={index}>{product.product.name}: {product.sales} sales</li>
            )) || <li>No data available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;