import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '@/config/constants';
import cartServiceInstance from '@/features/cart/CartService';
import axiosInstance from '@/config/axiosConfig';
import { 
  VisaIcon, MasterCardIcon, BitcoinIcon, PayPalIcon, 
  LockIcon, ZapIcon, CheckCircleIcon, LoaderIcon 
} from '@/assets/icons';

/**
 * @module PaymentForm
 * @description Cinema-grade payment processing with live card preview and multi-method support.
 * @author Senior Fintech & Frontend Engineer
 * @version 3.0.0
 */

const PaymentForm = () => {
  const [method, setMethod] = useState('card');
  const [formData, setFormData] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [status, setStatus] = useState('idle');
  const { total } = cartServiceInstance.getCartTotal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'number') {
      formattedValue = value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
    }
    if (name === 'expiry') {
      formattedValue = value.replace(/\W/gi, '').replace(/(.{2})/g, '$1/').substring(0, 5);
    }
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setFormData({ ...formData, [name]: formattedValue });
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setStatus('processing');
    
    try {
      await axiosInstance.post('/payments/charge', { 
        amount: total, 
        method, 
        details: formData 
      });
      setTimeout(() => {
        setStatus('success');
        cartServiceInstance.clearCart();
      }, 2500);
    } catch (error) {
      setStatus('idle');
      console.error('Payment Security Alert:', error);
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center py-20 bg-black/40 backdrop-blur-md rounded-3xl border border-gold/20"
      >
        <CheckCircleIcon className="w-24 h-24 text-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Authorized</h2>
        <p className="text-gray-400 tracking-widest text-xs uppercase">Your acquisition has been secured.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-black/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        <div className="space-y-10">
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
            {['card', 'paypal', 'crypto'].map((m) => (
              <button 
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 rounded-xl transition-all uppercase text-[10px] font-black tracking-[0.2em] ${
                  method === m ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {method === 'card' && (
              <motion.div 
                initial={{ rotateY: 90, opacity: 0 }} 
                animate={{ rotateY: 0, opacity: 1 }} 
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-full h-56 bg-gradient-to-br from-zinc-800 via-black to-zinc-900 rounded-[2rem] p-8 shadow-2xl border border-white/10 preserve-3d"
              >
                <div className="absolute top-8 right-8"><VisaIcon className="w-14 opacity-80" /></div>
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md mb-12 opacity-80" />
                <div className="text-2xl font-mono text-white tracking-[0.25em] mb-8">
                  {formData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end uppercase tracking-[0.15em]">
                  <div className="space-y-1">
                    <p className="text-[8px] text-gray-500">Holder</p>
                    <p className="text-xs text-white font-bold">{formData.name || 'SIGNATURE REQUIRED'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] text-gray-500">Expiry</p>
                    <p className="text-xs text-white font-bold">{formData.expiry || '00/00'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between text-xs tracking-widest uppercase">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs tracking-widest uppercase">
              <span className="text-gray-500">Secure Protocol Fee</span>
              <span className="text-gold">Incl.</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <span className="text-sm font-black text-white uppercase tracking-tighter">Total Due</span>
              <span className="text-xl font-black text-gold">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={processPayment} className="space-y-6 flex flex-col justify-center">
          <div className="grid grid-cols-1 gap-5">
            <div className="relative group">
              <input 
                name="name" required placeholder="Full Legal Name" onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:border-gold/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="relative group">
              <input 
                name="number" required placeholder="Card Number" value={formData.number} onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white font-mono focus:border-gold/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <input 
                name="expiry" required placeholder="MM / YY" value={formData.expiry} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:border-gold/50 outline-none transition-all placeholder:text-gray-600"
              />
              <input 
                name="cvc" required placeholder="CVC" value={formData.cvc} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white focus:border-gold/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={status === 'processing'}
            className="group relative w-full py-5 bg-gold overflow-hidden rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 text-black font-black uppercase tracking-[0.3em] text-xs">
              {status === 'processing' ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LockIcon className="w-4 h-4" />
                  Complete Acquisition
                </>
              )}
            </div>
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
              style={{ opacity: 0.2 }}
            />
          </button>
          
          <div className="flex items-center justify-center gap-6 opacity-30 grayscale pt-4">
            <VisaIcon className="w-10" />
            <MasterCardIcon className="w-10" />
            <PayPalIcon className="w-10" />
            <BitcoinIcon className="w-10" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
