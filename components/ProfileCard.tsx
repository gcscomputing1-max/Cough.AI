
import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 dark:shadow-none border border-indigo-50 dark:border-slate-800"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=fff&color=6366f1`} 
              className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 object-cover"
              alt="Profile"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
        </div>
        
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          {user?.email?.split('@')[0] || 'Health Hero'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user?.email}</p>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-indigo-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Tests</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">14</p>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Health Score</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">92</p>
          </div>
        </div>

        <button className="w-full mt-8 py-3 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
