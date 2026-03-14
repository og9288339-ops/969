import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import productServiceInstance from '@/features/product/ProductService';
import { 
  FilterIcon, SearchIcon, SlidersIcon, 
  LayoutGridIcon, ListIcon, SparklesIcon 
} from '@/assets/icons';

/**
 * @module Shop
 * @description Cinema-grade marketplace gallery for $10k+ luxury enterprise
 * @author Senior Frontend Architect & UI Engineer
 * @version 3.0.0
 */

const ProductCard = React.lazy(() => import('@/components/ProductCard'));

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000000],
    sort: 'newest',
    search: ''
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productServiceInstance.getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Marketplace Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 lg:px-16 selection:bg-gold/30">
      
      {/* Header Section */}
      <header className="max-w-[1800px] mx-auto mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-gold/50" />
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">The Global Exchange</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">Showroom</span>
          </h1>
        </motion.div>
      </header>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
        
        {/* Advanced Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 space-y-12 p-10 bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[3rem]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-gold">
                <SlidersIcon className="w-4 h-4" /> Filters
              </h3>
              <button 
                onClick={() => setFilters({category: 'all', priceRange: [0, 10000000], sort: 'newest', search: ''})}
                className="text-[9px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
              <input 
                type="text"
                placeholder="Search Assets..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-xs font-medium focus:border-gold/40 outline-none transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-6">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Asset Class</p>
              <div className="grid grid-cols-1 gap-2">
                {['all', 'Timepieces', 'Automobiles', 'Art', 'Real Estate'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setFilters({...filters, category: cat})}
                    className={`text-left text-[10px] uppercase tracking-[0.2em] py-4 px-6 rounded-xl transition-all font-bold ${
                      filters.category === cat 
                        ? 'bg-gold text-black shadow-lg shadow-gold/10' 
                        : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                <span>Valuation Floor</span>
                <span className="text-gold font-mono">${(filters.priceRange[0]/1000).toLocaleString()}K</span>
              </div>
              <input 
                type="range" min="0" max="1000000" step="5000"
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-gold hover:accent-yellow-500 transition-all"
              />
            </div>
          </div>
        </aside>

        {/* Assets Gallery Area */}
        <main className="lg:col-span-3 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-zinc-900/40 p-1.5 rounded-xl border border-white/5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gold text-black shadow-lg' : 'text-zinc-600 hover:text-white'}`}
                >
                  <LayoutGridIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gold text-black shadow-lg' : 'text-zinc-600 hover:text-white'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                Showing <span className="text-white">{products.length}</span> verified results
              </p>
            </div>

            <select 
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
              className="bg-zinc-900/40 border border-white/10 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gold focus:ring-0 outline-none cursor-pointer"
            >
              <option value="newest">Recent Acquisitions</option>
              <option value="highest">Price: High to Low</option>
              <option value="lowest">Price: Low to High</option>
            </select>
          </div>

          <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[550px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
                ))
              ) : (
                products.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                  >
                    <Suspense fallback={<div className="h-[500px] bg-white/5 rounded-3xl" />}>
                      <ProductCard product={product} view={viewMode} />
                    </Suspense>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {!loading && products.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-60 text-center space-y-8"
            >
              <div className="relative inline-block">
                <SparklesIcon className="w-16 h-16 text-zinc-800 mx-auto" />
                <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full" />
              </div>
              <div className="space-y-2">
                <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-xs">No Assets Match Your Protocol</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Adjust filters to explore more of the inventory</p>
              </div>
              <button 
                onClick={() => setFilters({category: 'all', priceRange: [0, 10000000], sort: 'newest', search: ''})}
                className="px-10 py-4 bg-white/5 border border-white/10 text-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gold hover:text-black transition-all"
              >
                Reset System
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
