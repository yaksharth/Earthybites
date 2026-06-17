"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-brand-bg pt-32 selection:bg-brand-primary selection:text-white">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Huge Sticky Image Gallery */}
          <div className="lg:sticky lg:top-32 h-max">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="aspect-[3/4] bg-brand-secondary overflow-hidden"
             >
                <img src="https://images.unsplash.com/photo-1599579185184-ea23df12061d?q=80&w=2380&auto=format&fit=crop" className="w-full h-full object-cover" alt="Heritage Almonds" />
             </motion.div>
          </div>

          {/* Right: Product Details (Apple-style) */}
          <div className="flex flex-col pt-12">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest mb-6 text-brand-primary/60">
                <span>California, USA</span>
                <span className="w-1 h-1 bg-brand-primary/40 rounded-full"></span>
                <span>Harvest: Oct 2023</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl text-brand-primary mb-6">Heritage <br/> Almonds</h1>
              <p className="text-xl text-brand-primary mb-12 font-light">$24.00 <span className="text-brand-text/50 text-sm ml-2">/ 250g</span></p>
              
              <div className="mb-12">
                <p className="text-lg leading-relaxed text-brand-text/80 mb-6 font-light">
                  Sourced from multi-generational orchards in the Sacramento Valley. These non-pareil almonds offer a delicate crunch, sweet profile, and are packed with natural vitamin E and protein.
                </p>
              </div>

              {/* Weight Selector */}
              <div className="mb-12">
                <span className="uppercase tracking-widest text-xs mb-4 block font-medium">Select Weight</span>
                <div className="grid grid-cols-3 gap-4">
                  {['250g', '500g', '1kg'].map((w, i) => (
                    <button key={w} className={`py-4 border text-sm font-medium transition-colors ${i === 0 ? 'border-brand-primary bg-brand-primary text-brand-secondary' : 'border-brand-text/20 hover:border-brand-primary'}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button className="w-full bg-brand-primary text-brand-secondary py-5 text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors mb-16">
                Add to Cart — $24.00
              </button>

              {/* Accordion / Details */}
              <div className="border-t border-brand-text/20 divide-y divide-brand-text/20">
                 {['Nutrition Profile', 'Origin Story', 'Storage Recommendations'].map((item) => (
                   <div key={item} className="py-6 flex justify-between items-center cursor-pointer group">
                     <span className="font-serif text-2xl group-hover:text-brand-accent transition-colors">{item}</span>
                     <span className="text-2xl font-light">+</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
