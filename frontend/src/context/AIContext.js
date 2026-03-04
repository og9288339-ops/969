import React, { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const generateDescription = async (productName, category, features) => {
    setLoading(true);
    try {
      const res = await axios.post('/ai/generate-description', { productName, category, features });
      setLoading(false);
      return res.data.data;
    } catch (error) {
      setLoading(false);
      toast.error('AI description generation failed');
      return null;
    }
  };

  const getPricingSuggestion = async (productName, category, marketData) => {
    setLoading(true);
    try {
      const res = await axios.post('/ai/pricing', { productName, category, marketData });
      setLoading(false);
      return res.data.data.suggestion;
    } catch (error) {
      setLoading(false);
      toast.error('AI pricing suggestion failed');
      return null;
    }
  };

  const predictSales = async (productData, historicalSales) => {
    setLoading(true);
    try {
      const res = await axios.post('/ai/predict-sales', { productData, historicalSales });
      setLoading(false);
      return res.data.data;
    } catch (error) {
      setLoading(false);
      toast.error('AI sales prediction failed');
      return null;
    }
  };

  const getRecommendations = async (userHistory, currentProducts) => {
    setLoading(true);
    try {
      const res = await axios.post('/ai/recommendations', { userHistory, currentProducts });
      setLoading(false);
      return res.data.data.recommendations;
    } catch (error) {
      setLoading(false);
      toast.error('AI recommendations failed');
      return null;
    }
  };

  const getAnalyticsInsights = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/ai/analytics-insights', { data });
      setLoading(false);
      return res.data.data;
    } catch (error) {
      setLoading(false);
      toast.error('AI analytics insights failed');
      return null;
    }
  };

  return (
    <AIContext.Provider value={{
      loading,
      generateDescription,
      getPricingSuggestion,
      predictSales,
      getRecommendations,
      getAnalyticsInsights
    }}>
      {children}
    </AIContext.Provider>
  );
};