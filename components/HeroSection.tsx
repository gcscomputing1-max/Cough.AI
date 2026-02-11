
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Version 4.0 Neural Engine Live
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
            Breath in, <span className="gradient-text">Sync</span> with AI
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Advanced audio biomarkers for respiratory diagnostics. Analyze cough patterns with clinical precision in under 3 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/ai-demo"
              className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Analyze Now
            </Link>
            <Link
              to="/dashboard"
              className="px-12 py-5 glass text-gray-700 dark:text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:shadow-xl transition-all border border-gray-200 dark:border-white/10 transform hover:-translate-y-1 active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* 3D-like floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"
      ></motion.div>

      {/* Hero Animation Placeholder - Abstract Sound Wave */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <path 
            d="M0 200 Q 100 50, 200 200 T 400 200 T 600 200 T 800 200" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-indigo-600 dark:text-indigo-400 animate-pulse"
          />
          <path 
            d="M0 200 Q 100 350, 200 200 T 400 200 T 600 200 T 800 200" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            className="text-purple-600 dark:text-purple-400 animate-pulse [animation-delay:0.5s]"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
