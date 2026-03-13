import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Bitcoin,
  Loader2,
  ArrowRight
} from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting
