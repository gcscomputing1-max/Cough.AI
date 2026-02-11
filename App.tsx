
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AIDemo from './pages/AIDemo';
import BlogList from './pages/BlogList';
import BlogPostPage from './pages/BlogPostPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import AIChatbot from './components/AIChatbot';
import { supabase } from './lib/supabaseClient';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setSession(null); 
          setLoading(false);
        }
      }
    };
    checkSession();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse tracking-widest text-xs uppercase">Initializing Engine...</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen transition-colors duration-500">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-demo" element={<AIDemo />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <AIChatbot />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
