'use client';

import { motion } from 'framer-motion';
import { useScroll, SECTIONS } from '@/context/ScrollContext';

export default function Navigation({ onToggleConsole }) {
  const { activeSection, scrollProgress, scrollToSection } = useScroll();

  const navBg = scrollProgress > 0.05
    ? 'bg-[#030303]/80 border-white/[0.06]'
    : 'bg-[#030303]/40 border-white/[0.03]';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 py-4 md:py-5 border-b backdrop-blur-[12px] pointer-events-auto transition-colors duration-700 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center select-none">

        {/* Logo */}
        <button
          onClick={() => scrollToSection(0)}
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

        {/* Section pills */}
        <ul className="flex items-center gap-1 bg-[#0a0a0a]/60 rounded-full px-2 py-1.5 border border-white/[0.05]">
          {SECTIONS.map((section, i) => {
            const isActive = activeSection === i;
            return (
              <li key={section.id} className="relative">
                <button
                  onClick={() => scrollToSection(i)}
                  className={`px-3 py-1.5 text-[9px] md:text-[10px] font-mono font-bold tracking-widest rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    isActive ? '' : 'text-white/45 hover:text-white/80'
                  }`}
                  style={{ color: isActive ? section.color : undefined }}
                >
                  <span className="relative z-10">{section.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full border"
                      style={{
                        backgroundColor: `${section.color}0d`,
                        borderColor:     `${section.color}30`,
                        boxShadow:       `0 0 10px ${section.color}1a`,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Console trigger */}
        <button
          onClick={onToggleConsole}
          className="hidden lg:flex items-center gap-2 font-mono text-[9px] text-cyan-400/80 hover:text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-400/40 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer focus:outline-none"
          style={{ boxShadow: '0 0 10px rgba(6,182,212,0.05)' }}
        >
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span>SYS_CONSOLE [~]</span>
        </button>

      </div>
    </motion.nav>
  );
}
