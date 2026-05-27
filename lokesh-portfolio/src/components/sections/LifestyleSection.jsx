'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '@/data/personal';
import { ShieldCheck, Target, Heart } from 'lucide-react';
import useGlitchText from '@/lib/useGlitchText';

// Specific metric values mapped per lifestyle item to enrich the HUD readouts
const itemMetrics = {
  'Gym Discipline': { index: '98%', speed: 'DAILY', status: 'HYPERTROPHY_ACTIVE' },
  'Late-Night Coding': { index: '95%', speed: '02:00_AM', status: 'DEEP_FLOW_STATE' },
  'Bikes & Cars': { index: '90%', speed: '120_KMH', status: 'ENGINE_SYNC_STABLE' },
  'Pets': { index: '85%', speed: 'CONSTANT', status: 'COMPANION_LINK_ACTIVE' },
  'Traveling': { index: '80%', speed: 'SEASONAL', status: 'MAP_EXPLORE_ON' },
  'Deep Work': { index: '99%', speed: '4_HRS', status: 'ISOLATED_FOCUS_OK' },
  'Cricket': { index: '85%', speed: 'WEEKLY', status: 'STRATEGY_PLAY_ON' },
  'Self-Growth': { index: '99%', speed: 'INFINITE', status: 'EVOLUTION_THREAD_RUNNING' },
};

export default function LifestyleSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Glitch text hooks
  const mainTitle = useGlitchText('The Human Vector', 20, 10);
  const behavioralHeader = useGlitchText('BEHAVIORAL_HUD', 25, 8);

  const activeItem = personalData.lifestyle[selectedIndex] || personalData.lifestyle[0];
  const metrics = itemMetrics[activeItem.name] || { index: '90%', speed: 'STABLE', status: 'ACTIVE' };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-12 items-center justify-between select-none py-4">
      
      {/* Left Pane: Interactive Grid list of 8 lifestyle elements */}
      <div className="w-full xl:w-1/2 space-y-8 z-30">
        <div className="text-left space-y-3">
          <div className="inline-flex items-center gap-2.5 bg-black/60 px-4 py-1.5 rounded-none border border-cyan-500/20 relative">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
            <Heart className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              {behavioralHeader}
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-white">
            {mainTitle}
          </h2>

          <p className="font-mono text-sm text-white/50 leading-relaxed max-w-xl">
            Human factors shaping software execution. The daily discipline principles that drive consistent building. Select a facet to inspect telemetry details.
          </p>
        </div>

        {/* Grid of interactive tags (4 columns on large screens) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {personalData.lifestyle.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={item.name}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => setSelectedIndex(idx)}
                className={`p-4 rounded-none border flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer text-center focus:outline-none relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'border-white/5 bg-black/40 hover:border-cyan-500/20 hover:bg-white/5'
                }`}
              >
                {/* Selector notch */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400 opacity-40" />
                
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <span className={`font-display text-xs font-semibold transition-colors ${
                  isSelected ? 'text-cyan-300' : 'text-white/70'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Behavioral Telemetry Monitor */}
      <div className="w-full xl:w-1/2 flex items-center justify-center xl:justify-end">
        <div className="w-full max-w-2xl bg-black/75 border border-cyan-500/20 p-6 md:p-8 space-y-6 border-l-4 border-l-cyan-400 rounded-none shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
          {/* Cyber notches */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />

          {/* Monitor Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/10">
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400/80 tracking-widest">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>BEHAVIORAL_SPECS // OK</span>
            </div>
            <div className="font-mono text-[10px] text-white/30 tracking-widest">ID: BEH_0{selectedIndex + 1}</div>
          </div>

          {/* Animated Detail Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-6">
                {/* Image Display inside Monitor */}
                <div className="w-full flex-shrink-0">
                  {activeItem.image ? (
                    <div className="relative w-full h-64 md:h-80 bg-black/60 border border-cyan-500/20 rounded-none overflow-hidden group shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                      <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeItem.image} alt={activeItem.name} className="w-full h-full object-contain object-center filter grayscale-[40%] contrast-125 group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105" />
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 z-20" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 z-20" />
                    </div>
                  ) : (
                    <div className="w-full h-48 md:h-64 bg-black/40 border border-cyan-500/20 flex flex-col items-center justify-center text-4xl shadow-inner relative">
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400/40" />
                      {activeItem.icon}
                      <span className="font-mono text-[10px] text-white/30 mt-2">NO_VISUAL_DATA</span>
                    </div>
                  )}
                </div>

                {/* Info block below image */}
                <div className="w-full space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
                      {activeItem.name}
                    </h3>
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                      Telemetry Verified
                    </span>
                  </div>

                  {/* Description */}
                  <div className="font-mono text-sm text-white/70 leading-relaxed bg-cyan-950/10 p-4 rounded-none border border-cyan-500/15 relative">
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/30" />
                    {activeItem.description}
                  </div>
                </div>
              </div>

              {/* Spec sheet parameters */}
              <div className="grid grid-cols-3 gap-4 text-left pt-2">
                <div className="bg-black/40 border border-cyan-500/10 p-3 rounded-none relative">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/20" />
                  <span className="font-mono text-[9px] text-white/40 uppercase block mb-1">DISCIPLINE</span>
                  <span className="font-display font-bold text-lg text-cyan-300">{metrics.index}</span>
                </div>
                <div className="bg-black/40 border border-cyan-500/10 p-3 rounded-none relative">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/20" />
                  <span className="font-mono text-[9px] text-white/40 uppercase block mb-1">FREQUENCY</span>
                  <span className="font-display font-bold text-lg text-purple-400">{metrics.speed}</span>
                </div>
                <div className="bg-black/40 border border-cyan-500/10 p-3 rounded-none relative">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/20" />
                  <span className="font-mono text-[9px] text-white/40 uppercase block mb-1">SYNC</span>
                  <span className="font-mono text-sm text-white/80 font-bold block truncate">100%</span>
                </div>
              </div>

              {/* Behavior Logs read out */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/20 px-4 py-2.5 rounded-none border border-cyan-500/10 relative">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/30" />
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="truncate tracking-wider">SYS_LOG: {metrics.status}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
