
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Abstract C / Neural Pattern */}
        <path 
          d="M75 25 C 45 15, 15 45, 15 75 C 15 95, 45 85, 75 75" 
          fill="none" 
          stroke="url(#logoGrad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        {/* Waveform */}
        <path 
          d="M30 50 Q 40 20, 50 50 T 70 50" 
          fill="none" 
          stroke="white" 
          strokeWidth="4" 
          className="dark:stroke-indigo-400"
        />
        {/* Nodes */}
        <circle cx="75" cy="25" r="4" fill="#a855f7" />
        <circle cx="75" cy="75" r="4" fill="#6366f1" />
        <circle cx="15" cy="75" r="3" fill="#818cf8" />
      </svg>
      <span className="text-xl font-black tracking-tighter dark:text-white">
        Cough<span className="text-indigo-500">.ai</span>
      </span>
    </div>
  );
};

export default Logo;
