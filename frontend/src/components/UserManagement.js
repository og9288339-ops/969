import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Activity, 
  ShieldAlert,
  Search,
  Filter,
  Edit3,
  Key,
  UserX,
  Trash2,
  Check,
  X,
  ChevronDown,
  Loader2
} from 'lucide-react';
import './UserManagement.css';

const UserManagement = memo(() => {
  const [users,
