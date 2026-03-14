import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthService from '@/features/auth/AuthService';
import ProductService from '@/features/product/ProductService';
import CartService from '@/features/cart/CartService';
import { 
  ZapIcon, UserIcon, WalletIcon, TrendingUpIcon, 
  CrownIcon, PackageIcon, SettingsIcon, LogOutIcon,
  ChevronRightIcon, BellIcon
} from '@/assets/icons';

/**
 * @module Dashboard
 * @description VIP Command Center for $10k+ luxury MERN marketplace
 * @author Senior Full-Stack Architect
 * @version 3.0.0
 */

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    activeBids: 0,
    securedAssets: 0,
    walletBalance: 0
  });

  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    if (userData) {
      setUser(userData);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const recs = await ProductService.getFeaturedProducts();
      setRecommendations(recs.slice(0, 3));
      
      const { total } = CartService.getCartTotal();
      setStats({
        totalValue: total * 15.8, 
        activeBids: 3,
        securedAssets: 8,
        walletBalance: 250000
      });
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold/30 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col py-12 z-50">
        <div className="px-8 mb-16">
          <div className="flex items-center gap-3">
            <CrownIcon className="w-10 h-10 text-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
            <span className="hidden lg:block font-black tracking-tighter text-2xl uppercase">Global Elite</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-4">
          {[
            { icon: UserIcon, label: 'Executive Profile', active: true },
            { icon: WalletIcon, label: 'Asset Wallet' },
            { icon: PackageIcon, label: 'Vault Collection' },
            { icon: TrendingUpIcon, label: 'Market Analytics' },
            { icon: SettingsIcon, label: 'Security Config' }
          ].map((item, idx) => (
            <button 
              key={idx} 
              className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all group ${
                item.active ? 'bg-gold/10 text-gold border border-gold/10' : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block text-[10px] uppercase tracking-[0.25em] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <button 
            onClick={() => AuthService.logout()} 
            className="flex items-center gap-4 w-full p-4 text-zinc-600 hover:text-red-500 transition-colors group"
          >
            <LogOutIcon className="w-5 h-5" />
            <span className="hidden lg:block text-[10px] uppercase tracking-[0.2em] font-black">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20 lg:pl-72 min-h-screen">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1400px] mx-auto p-8 lg:p-16 space-y-16"
        >
          {/* Top Bar */}
          <header className="flex justify-between items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.5em] font-black mb-2">Private Terminal</h2>
              <div className="flex items-center gap-4">
                <div className="h-10 w-[2px] bg-gold" />
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-zinc-700">{user.username}</span>
                </h1>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex gap-4 items-center">
              <button className="relative p-3 bg-white/5 rounded-full border border-white/10 hover:border-gold/30 transition-all group">
                <BellIcon className="w-5 h-5 text-zinc-400 group-hover:text-gold" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full border-2 border-black" />
              </button>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black text-gold tracking-widest uppercase">Member Since</span>
                <span className="text-xs font-mono text-zinc-400">MAR 2026</span>
              </div>
            </motion.div>
          </header>

          {/* Luxury Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Available Liquidity', value: `$${stats.walletBalance.toLocaleString()}`, icon: WalletIcon, trend: '+12.5%' },
              { label: 'Total Portfolio', value: `$${stats.totalValue.toLocaleString()}`, icon: TrendingUpIcon, trend: '+4.2%' },
              { label: 'Active Acquisitions', value: stats.activeBids, icon: ZapIcon, trend: 'Live' },
              { label: 'Secured Assets', value: stats.securedAssets, icon: CrownIcon, trend: 'Protected' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="bg-zinc-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className="w-16 h-16" />
                </div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${idx === 2 ? 'bg-gold/10 text-gold' : 'bg-green-500/10 text-green-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Market Activity Table */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                  <PackageIcon className="w-5 h-5 text-gold" /> Recent Acquisitions
                </h3>
                <button className="text-[10px] text-zinc-500 hover:text-gold uppercase tracking-widest transition-colors flex items-center gap-1">
                  View Full Archive <ChevronRightIcon className="w-3 h-3" />
                </button>
              </div>
              
              <div className="bg-zinc-900/20 rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                      <th className="px-8 py-6">Asset Reference</th>
                      <th className="px-8 py-6 text-center">Protocol Status</th>
                      <th className="px-8 py-6 text-right">Market Valuation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[1, 2, 3, 4].map((_, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tighter">Patek Philippe Nautilus</p>
                              <p className="text-[9px] text-zinc-600 font-mono">#REF-5711/1A</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-block px-4 py-1.5 bg-green-500/10 text-green-500 text-[9px] font-black rounded-full uppercase tracking-widest border border-green-500/20">
                            Verified & Secured
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-mono text-gold text-sm">$142,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Concierge Panel */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                <ZapIcon className="w-5 h-5 text-gold animate-pulse" /> AI Portfolio Insights
              </h3>
              
              <div className="bg-gradient-to-b from-zinc-900 to-black p-10 rounded-[3rem] border border-gold/20 shadow-[0_20px_50px_rgba(212,175,55,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] rounded-full" />
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-10 italic relative z-10">
                  "Analysis of your investment pattern suggests an 84% compatibility with rare horological assets. I have isolated these items for your immediate review."
                </p>

                <div className="space-y-5 relative z-10">
                  {recommendations.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-5 p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:border-gold/40 transition-all cursor-pointer group/item"
                    >
                      <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden grayscale group-hover/item:grayscale-0 transition-all" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1 leading-none">{item.name}</p>
                        <p className="text-[12px] text-gold font-mono">${item.price?.toLocaleString()}</p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-zinc-700 group-hover/item:text-gold" />
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-10 py-5 bg-gold text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/10">
                  Initialize Concierge Call
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
