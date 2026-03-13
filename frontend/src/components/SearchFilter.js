import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Fire,
  Tag,
  DollarSign,
  Sliders
} from 'lucide-react';
import './SearchFilter.css';

const SearchFilter = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults
