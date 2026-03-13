import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  Search,
  RefreshCw,
  Download,
  Mail,
  Shield,
  Loader2
} from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const [searchValue, setSearchValue] = useState('');
  const [orderData, setOrderData]
