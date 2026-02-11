
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MOCK_BLOG_POSTS } from '../constants';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = MOCK_BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" />;

  return (
    <article className="bg-white">
      <div className="h-[400px] md:h-[500px] w-full relative">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <Link to="/blog" className="inline-flex items-center text-indigo-300 font-bold mb-4 hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-sm text-indigo-100 font-medium">
              <span><i className="fa-solid fa-user-doctor mr-2"></i>{post.author}</span>
              <span><i className="fa-solid fa-calendar mr-2"></i>{post.date}</span>
              <span><i className="fa-solid fa-clock mr-2"></i>6 min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-indigo prose-lg max-w-none">
          <p className="text-2xl font-medium text-gray-600 leading-relaxed mb-8 italic border-l-4 border-indigo-500 pl-6">
            {post.summary}
          </p>
          <div className="text-gray-800 leading-relaxed space-y-6">
            {post.content.split('\n').map((para, i) => (para.trim() && <p key={i}>{para}</p>))}
            <p>
              Respiratory sounds are one of the most accessible biomarkers for pulmonary health. Historically, physicians used stethoscopes to interpret these sounds, but human hearing is limited to specific frequency ranges. Modern AI models like the one powering Cough.ai can analyze the full acoustic spectrum, identifying patterns such as crepitations, wheezing, and variations in cough duration that are invisible to the naked ear.
            </p>
            <p>
              As we move towards a more decentralized healthcare model, tools that allow for remote monitoring will become essential. Early detection of a worsening dry cough could trigger a telehealth visit before a condition like bronchitis escalates into pneumonia.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src={`https://ui-avatars.com/api/?name=${post.author}&background=6366f1&color=fff`} className="w-14 h-14 rounded-full" alt={post.author} />
            <div>
              <p className="text-sm font-bold text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">Medical Content Contributor</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"><i className="fa-brands fa-twitter"></i></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"><i className="fa-brands fa-facebook"></i></button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-link"></i></button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
