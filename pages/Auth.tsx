
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'reset' | 'check-email'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unlocked = localStorage.getItem('coughai_demo_unlocked') === 'true';
    setIsDemoUnlocked(unlocked);

    const handleUnlock = () => setIsDemoUnlocked(true);
    window.addEventListener('demo-unlocked', handleUnlock);
    
    let timer: number;
    if (resendCooldown > 0) {
      timer = window.setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
      window.removeEventListener('demo-unlocked', handleUnlock);
    };
  }, [resendCooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setView('check-email');
      } else if (view === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setView('check-email');
        setMessage('Reset link sent!');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@cough.ai');
    setPassword('password123');
    setView('login');
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 dark:bg-purple-900/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-100 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">
          
          <AnimatePresence mode="wait">
            {view === 'check-email' ? (
              <motion.div 
                key="check-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-10 text-center"
              >
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <i className="fa-solid fa-paper-plane text-3xl text-indigo-600 animate-bounce"></i>
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Check your inbox</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                  We've sent a secure link to <span className="text-indigo-600 font-bold">{email}</span>. Click the link to verify your account.
                </p>
                <div className="space-y-4">
                  <button onClick={handleResend} disabled={resendCooldown > 0} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${resendCooldown > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend link'}
                  </button>
                  <button onClick={() => setView('login')} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                    Back to login
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="flex border-b border-gray-50 dark:border-slate-800">
                  {['login', 'signup'].map((v) => (
                    <button key={v} onClick={() => setView(v as any)} className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${(view as string) === v ? 'text-indigo-600 dark:text-indigo-400 bg-gray-50/50 dark:bg-slate-800/30' : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>

                <div className="p-10">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join Cough.ai' : 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {view === 'login' ? 'Continue tracking your health progress' : view === 'signup' ? 'Start your health journey today' : 'Enter email to receive instructions'}
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                    <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                      Continue with Google
                    </button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
                      <div className="relative flex justify-center text-[8px] uppercase font-black text-gray-300 dark:text-slate-700 tracking-[0.3em]"><span className="bg-white dark:bg-slate-900 px-4">Or use email</span></div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest mb-2 ml-2">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white" placeholder="name@example.com" required />
                    </div>
                    
                    {view !== 'reset' && (
                      <div>
                        <div className="flex justify-between items-center mb-2 px-2">
                          <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Password</label>
                          <button type="button" onClick={() => setView('reset')} className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline">Forgot?</button>
                        </div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white" placeholder="••••••••" required />
                      </div>
                    )}

                    <AnimatePresence>
                      {message && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-4 rounded-xl text-xs font-bold ${message.includes('Success') || message.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {message}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50">
                      {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : (view === 'reset' ? 'Send Reset Link' : view === 'login' ? 'Sign In' : 'Create Account')}
                    </button>

                    <AnimatePresence>
                      {isDemoUnlocked && view !== 'reset' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4">
                          <button type="button" onClick={fillDemoCredentials} className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all">
                            <i className="fa-solid fa-flask-vial mr-2"></i> Use Demo Credentials
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {view === 'reset' && (
                      <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest text-center">Back to Login</button>
                    )}
                  </form>
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-gray-300 dark:text-slate-700 uppercase tracking-widest">Secured Production Mode</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
