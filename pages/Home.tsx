
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import BlogCard from '../components/BlogCard';
import { MOCK_BLOG_POSTS } from '../constants';
import { trackPageView } from '../lib/supabaseClient';

const Home: React.FC = () => {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="animate-fadeIn overflow-x-hidden">
      <HeroSection />

      {/* Futuristic Feature Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">Neural Architecture</h2>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">Why Choose Cough.ai?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-brain', title: 'Neural Diagnostics', desc: 'Ensemble models trained on 1.2M+ clinical respiratory audio samples.' },
              { icon: 'fa-user-shield', title: 'Privacy First', desc: 'Optional Zero-Data mode ensuring audio is purged instantly after analysis.' },
              { icon: 'fa-hospital', title: 'Grounding Data', desc: 'Real-time medical center locating via verified Google Maps data.' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] glass border border-indigo-100/30 dark:border-white/5 shadow-xl hover:shadow-indigo-500/10 transition-all"
              >
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl mb-6">
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{f.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Live Metrics */}
      <section className="bg-gray-50 dark:bg-slate-900/50 py-16 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Active Users', val: '50K+' },
              { label: 'Precision Rate', val: '94.2%' },
              { label: 'Neural Layers', val: '128' },
              { label: 'Latency', val: '< 2.4s' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl font-black gradient-text group-hover:scale-110 transition-transform">{stat.val}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-xs mb-3">Health Insights</h2>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">Respiratory Wellness</h3>
            </div>
            <a href="#/blog" className="mt-6 md:mt-0 px-8 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold text-indigo-600 hover:shadow-lg transition-all">
              Explorer Archive <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_BLOG_POSTS.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / PWA Invite */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-[3.5rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to track your breath?
              </h3>
              <p className="text-indigo-100 text-lg mb-12 max-w-xl mx-auto opacity-90">
                Install Cough.ai as a PWA for offline monitoring and real-time medical alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl">
                  Install PWA
                </button>
                <button className="px-10 py-5 bg-indigo-500 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-400 transition-colors">
                  Join Newsletter
                </button>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
