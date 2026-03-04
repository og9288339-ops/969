import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import ProductCard from './ProductCard';

const AIRecommendations = ({ userHistory }) => {
  const [recommendations, setRecommendations] = useState([]);
  const { getRecommendations, loading } = useAI();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recs = await getRecommendations(userHistory, []);
      if (recs) {
        // Parse recommendations (assuming AI returns a string, parse it)
        setRecommendations(recs.split('\n').filter(item => item.trim()));
      }
    };
    if (userHistory) {
      fetchRecommendations();
    }
  }, [userHistory]);

  if (loading) return <div className="loading">Loading AI recommendations...</div>;

  return (
    <div className="card">
      <h3>AI Recommendations</h3>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default AIRecommendations;