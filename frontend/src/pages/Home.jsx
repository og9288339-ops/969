import React, { useState, useEffect, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductService from '@/features/product/ProductService';
import { THEME } from '@/config/constants';
import { 
  ZapIcon, CrownIcon, ShieldCheckIcon, 
  ChevronDownIcon, SparklesIcon, ArrowRightIcon 
} from '@/assets/icons';

/**
 * @module Home
 * @description Cinema-grade homepage for $10k+ luxury enterprise marketplace
 * @author World-Class Frontend Architect & Creative Director
 * @version 4.0.0
 */

const ProductCard = React.lazy(() => import('@/components/ProductCard'));

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await ProductService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Asset Synchronization Error:", error);
      }
    };
    loadAssets();
  }, []);

  return (
    <div className="bg-[#050505] text-white selection:bg-gold/30 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#050505] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1614165933388-9b55d38522f3?auto=format&fit=crop&q=80&w=2400" 
            alt="Luxury Heritage" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-gold/50" />
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.8em]">
                ESTABLISHED 2026
              </span>
              <div className="h-[1px] w-8 bg-gold/50" />
            </div>

            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black uppercase tracking-tighter leading-[0.8] mb-10">
              Limitless <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800">Legacy</span>
            </h1>

            <p className="max-w-xl mx-auto text-zinc-500 text-xs md:text-sm leading-relaxed mb-12 font-medium tracking-[0.1em] uppercase">
              The premier digital destination for high-protocol asset acquisition and elite portfolio management.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button className="group relative px-12 py-6 bg-gold text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <span className="relative z-10 flex items-center gap-2">
                  Initialize Acquisition <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              
              <button className="px-12 py-6 border border-white/10 backdrop-blur-xl text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all duration-500">
                Private Inventory
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 opacity-20"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* --- PROTOCOL BAR --- */}
      <div className="border-y border-white/5 bg-black py-12">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30">
          {[
            { icon: CrownIcon, text: "Heritage Verified" },
            { icon: ShieldCheckIcon, text: "Encrypted Protocol" },
            { icon: ZapIcon, text: "Instant Settlement" },
            { icon: SparklesIcon, text: "Neural Intelligence" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center group hover:opacity-100 transition-opacity">
              <item.icon className="w-5 h-5 text-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- CURATED SHOWCASE --- */}
      <section className="py-40 px-8 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-baseline mb-24 gap-8">
          <div className="space-y-4">
            <h2 className="text-gold text-[11px] font-black uppercase tracking-[0.6em] flex items-center gap-3">
              <div className="w-10 h-[1px] bg-gold" /> Private Collection
            </h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">New Acquisitions</h3>
          </div>
          <p className="max-w-md text-zinc-500 text-sm font-light leading-relaxed border-l border-white/10 pl-8">
            Each asset undergoes a rigorous 48-point verification protocol before entering our global inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <Suspense fallback={<div className="h-[500px] w-full bg-white/5 animate-pulse rounded-[2rem]" />}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="group relative h-[600px] rounded-[2.5rem] bg-zinc-900/20 border border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
              ))
            )}
          </Suspense>
        </div>
      </section>

      {/* --- AI CONCIERGE INTEGRATION --- */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-20 bg-gold/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                alt="AI Neural Link"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <SparklesIcon className="w-8 h-8 text-gold animate-pulse" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              The Neural <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Concierge</span>
            </h2>
            <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-lg">
              Our proprietary AI doesn't just suggest—it predicts. Leveraging global market trends and personal behavioral data to secure your next legacy asset.
            </p>
            <button className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] bg-white/5 px-10 py-5 rounded-2xl border border-white/10 hover:border-gold/40 transition-all group">
              Initialize AI Consultation
              <div className="flex items-center group-hover:gap-2 transition-all">
                <div className="w-12 h-[1px] bg-gold" />
                <ArrowRightIcon className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="py-40 border-t border-white/5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-8"
        >
          <h4 className="text-gold text-[10px] font-black uppercase tracking-[1em] mb-12">The Final Protocol</h4>
          <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16">Ready for <br /> Ascension?</h3>
          <button className="px-20 py-8 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-full hover:bg-gold transition-all duration-700 shadow-[0_20px_60px_rgba(255,255,255,0.1)]">
            Create VIP Account
          </button>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;
