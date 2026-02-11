
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold gradient-text">Cough.ai</Link>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering global respiratory health through artificial intelligence and sound analysis.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/ai-demo" className="hover:text-white transition-colors">AI Demo</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Health Blog</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors"><i className="fa-brands fa-github"></i></a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-500">Subscribe for medical alerts & updates</p>
              <div className="mt-2 flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-gray-800 text-white text-sm px-3 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                />
                <button className="bg-indigo-600 px-4 py-2 rounded-r hover:bg-indigo-700 transition-colors">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Cough.ai. All rights reserved. For informational purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
