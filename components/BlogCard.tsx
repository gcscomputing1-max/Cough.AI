
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
            Health News
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.summary}
        </p>
        <Link 
          to={`/blog/${post.slug}`}
          className="text-indigo-600 font-semibold text-sm inline-flex items-center hover:underline"
        >
          Read Article
          <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
