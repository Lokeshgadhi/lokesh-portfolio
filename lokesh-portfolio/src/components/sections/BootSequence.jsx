'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const bootLogs = [
  "INITIALIZING NEURAL PROTOCOLS...",
  "LOADING CORE MEMORIES...",
  "ESTABLISHING SECURE CONNECTION...",
  "MOUNTING VIRTUAL DOM...",
  "WAKING UP THE SYSTEM..."
];

export default function BootSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        
        // Update log index based on progress
        const nextIndex = Math.floor((prev / 100) * bootLogs.length);
        if (nextIndex !== logIndex && nextIndex < bootLogs.length) {
          setLogIndex(nextIndex);
        }
        
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete, logIndex]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] text-cyan-400 font-mono overflow-hidden"
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at center, transparent 0%, #030303 100%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.1) 2px, rgba(6, 182, 212, 0.1) 4px)' 
           }} 
      />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl md:text-3xl font-bold mb-8 tracking-widest uppercase"
          style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}
        >
          LOKESH.OS // BOOT
        </motion.div>
        
        {/* Advanced Progress Bar */}
        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden relative mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white" 
            style={{ width: `${progress}%` }} 
          />
          {/* Glowing tip */}
          <div 
            className="absolute top-0 h-full w-4 bg-white blur-[2px]"
            style={{ left: `calc(${progress}% - 4px)` }}
          />
        </div>

        <div className="flex justify-between w-full text-xs md:text-sm font-semibold opacity-80">
          <span className="animate-pulse">{bootLogs[logIndex] || "SYSTEM READY"}</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
