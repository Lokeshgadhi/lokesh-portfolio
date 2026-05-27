'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'BOOT', target: 'boot' },
  { name: 'SKILLS', target: 'skills' },
  { name: 'PROJECTS', target: 'projects' },
  { name: 'TIMELINE', target: 'experience' },
  { name: 'LIFESTYLE', target: 'lifestyle' },
  { name: 'CONTACT', target: 'contact' },
];

export default function Navigation({ onToggleConsole }) {
  const [activeTab, setActiveTab] = useState('boot');

  useEffect(() => {
    const handleScroll = () => {
      // Calculate which element is currently in view
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.target);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveTab(item.target);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 90; // offset for sticky navigation header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 py-4 md:py-5 bg-[#030303]/60 border-b border-white/[0.05] backdrop-blur-[10px] pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center select-none">
        
        {/* Futuristic Logo */}
        <button
          onClick={() => handleScrollTo('boot')}
          className="flex items-center gap-2 group focus:outline-none cursor-pointer"
        >
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-display font-black text-xs text-white">
              LK
            </div>
          </div>
          <span className="font-display font-bold text-sm tracking-widest hidden sm:inline text-white/95">
            LOKESH<span className="text-cyan-400">.SYSTEM</span>
          </span>
        </button>

        {/* Center Navigation Links */}
        <ul className="flex items-center gap-1 bg-[#0a0a0a]/60 rounded-full px-2 py-1.5 border border-white/[0.05]">
          {navItems.map((item) => {
            const isActive = activeTab === item.target;
            return (
              <li key={item.name} className="relative">
                <button
                  onClick={() => handleScrollTo(item.target)}
                  className={`px-3 py-1.5 text-[9px] md:text-[10px] font-mono font-bold tracking-widest rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    isActive ? 'text-cyan-300' : 'text-white/45 hover:text-white/80'
                  }`}
                >
                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>

                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white/5 rounded-full border border-cyan-400/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      style={{
                        boxShadow: '0 0 10px rgba(6,182,212,0.1)',
                      }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Corner Telemetry Status Indicator (Console Trigger) */}
        <button
          onClick={onToggleConsole}
          className="hidden lg:flex items-center gap-2 font-mono text-[9px] text-cyan-400/80 hover:text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-400/40 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer focus:outline-none"
          style={{
            boxShadow: '0 0 10px rgba(6,182,212,0.05)',
          }}
        >
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span>SYS_CONSOLE [~]</span>
        </button>
      </div>
    </motion.nav>
  );
}
