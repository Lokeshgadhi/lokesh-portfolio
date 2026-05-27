'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { personalData } from '@/data/personal';

export default function HeroSection({ onNext }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center select-none">
      
      {/* Top tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-6 z-20"
      >
        <div className="inline-flex items-center gap-3 glass-strong rounded-full px-5 py-2 pointer-events-auto">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400 uppercase">
            System Online // CORE_LOADED
          </span>
        </div>
      </motion.div>

      {/* Holographic Avatar Scan */}
      {personalData.avatar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mb-6 w-20 h-20 md:w-24 md:h-24 rounded-full border border-cyan-400/30 relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.15)] pointer-events-auto"
        >
          <img src={personalData.avatar} alt="Lokesh Kumar G" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
          {/* Laser scanning bar */}
          <div className="absolute inset-x-0 h-0.5 bg-cyan-400/60 shadow-[0_0_8px_#06b6d4] pointer-events-none"
               style={{
                 animation: 'scan 2.5s linear infinite',
               }}
          />
        </motion.div>
      )}

      {/* Main name */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="font-display font-bold tracking-tighter leading-none mb-6 z-20"
        style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
      >
        <span className="block neon-text">LOKESH</span>
        <span className="block gradient-text">KUMAR G</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="font-mono text-xs md:text-sm text-white/70 tracking-wider mb-8 max-w-xl z-20 px-4"
      >
        {personalData.tagline}
      </motion.p>

      {/* Identity rotator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.0 }}
        className="flex flex-wrap gap-2 justify-center mb-10 max-w-2xl z-20 px-4"
      >
        {personalData.identity.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.08 }}
            className="text-[10px] md:text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 glass rounded-full text-white/80 border border-white/5"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Sync trigger button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="z-20 pointer-events-auto"
      >
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-8 py-3.5 rounded-full overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1.5px] bg-black rounded-full" />
          <span className="relative font-display font-bold text-xs tracking-[0.2em] text-cyan-300 group-hover:text-cyan-200 flex items-center gap-2.5">
            [ INITIATE SYNAPTIC OVERLAY ]
            <Play className="w-3.5 h-3.5 fill-cyan-300 text-transparent" />
          </span>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-20 blur-xl group-hover:opacity-45 transition-opacity -z-10" />
        </motion.button>
      </motion.div>

      {/* Cyber HUD elements specifically positioned inside viewport */}
      <div className="absolute top-10 left-0 font-mono text-[9px] text-cyan-400/50 hidden md:block text-left">
        <div className="space-y-1">
          <div>COORD_X: 16.5667°N</div>
          <div>COORD_Y: 81.5167°E</div>
          <div>KERNEL: ACTIVE_SYS_PROCESS</div>
        </div>
      </div>
      <div className="absolute top-10 right-0 font-mono text-[9px] text-cyan-400/50 hidden md:block text-right">
        <div className="space-y-1">
          <div>ARCHIVE_SYS_ID: LK_G_2004</div>
          <div>SW_VER_DEPLOY: 1.0.0</div>
          <div>STATUS: COMPILING_MIND</div>
        </div>
      </div>

      {/* Bottom indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-auto"
        onClick={onNext}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
          Sync mind matrix
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
      </motion.div>
    </div>
  );
}
