/**
 * @module AdminPanel
 * @description World-class admin dashboard layout for luxury e-commerce
 * @author Senior UI/UX Architect
 * @version 3.0.0
 * @since 2024
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Sidebar Icons
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Brain, 
  Settings,
  // Top Nav Icons
  Menu, 
  X,
  Search, 
  Bell, 
  UserCircle, 
  ChevronDown,
  // Stats Icons
  DollarSign,
  PackageCheck,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SalesAnalytics from './SalesAnalytics';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import './AdminPanel.css';

/**
 * Page configuration with icons and components
 */
const PAGES = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, component: SalesAnalytics },
  { id: 'products', name: 'Products', icon: Package, component: () => <div>Products Management</div> },
  { id: 'orders', name: 'Orders', icon: ShoppingCart, component: OrderManagement },
  { id: 'users
