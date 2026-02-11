
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import { MOCK_BLOG_POSTS } from '../constants';
import { BlogCategory } from '../types';

const BlogList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: (BlogCategory | 'All')[] = ['All', 'AI', 'COVID', 'Asthma', 'Respiratory Health'];

  const filteredPosts = MOCK_BLOG_POSTS.filter(post => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6"
          >
            Health <span className="gradient-text">Resources</span>
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Stay ahead of respiratory issues with deep dives into AI diagnostics and wellness.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPosts.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-gray-300 dark:text-slate-700 text-6xl mb-4">
              <i className="fa-solid fa-file-circle-question"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">No articles found</h3>
            <p className="text-gray-400 dark:text-gray-600 mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
