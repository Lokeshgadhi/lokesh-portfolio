'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '@/data/personal';
import { ArrowUpRight, Cpu, Network, Monitor } from 'lucide-react';
import useGlitchText from '@/lib/useGlitchText';

export default function ProjectsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Glitch text hooks
  const mainTitle = useGlitchText('Core Deployments', 20, 10);
  const activeSystemsHeader = useGlitchText('LAYER_03 // ACTIVE_SYSTEMS', 25, 8);

  return (
    <div className="w-full h-full flex flex-col justify-center select-none py-10 md:py-0">
      
      {/* Section Header */}
      <div className="mb-8 text-left max-w-xl">
        <div className="inline-flex items-center gap-2.5 bg-black/60 px-4 py-1.5 rounded-none border border-cyan-500/20 mb-4 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
          <Monitor className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            {activeSystemsHeader}
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-none mb-3 text-white">
          {mainTitle}
        </h2>
        <p className="font-mono text-xs text-white/50 leading-relaxed">
          Production systems currently live in the digital space. Select a terminal console to launch direct browser connection.
        </p>
      </div>

      {/* Dual Column Project Terminals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        {personalData.projects.map((project, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <motion.div
              key={project.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group rounded-none bg-black/80 border border-cyan-500/25 p-5 md:p-6 overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.02)] transition-shadow duration-300"
              style={{
                boxShadow: isHovered ? `0 0 25px rgba(6,182,212,0.08)` : 'none',
              }}
            >
              {/* Notched cyan corner indicators */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />

              {/* Background grid backing */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none" 
                   style={{
                     backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)',
                     backgroundSize: '12px 12px'
                   }} 
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500`} />

              <div>
                {/* Card HUD Header */}
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10 mb-4 font-mono text-[9px] text-cyan-400 tracking-wider">
                  <div className="flex items-center gap-1.5 font-bold uppercase">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SYS_DEV_0{project.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white/30 uppercase mr-1">PING_SEC:</span>
                    <span className="text-cyan-300 font-bold bg-cyan-950/40 px-1.5 py-0.5 border border-cyan-500/30 tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                    {project.name}
                  </h3>
                  <div className="inline-block font-mono text-[8px] text-cyan-300/80 tracking-widest uppercase border border-cyan-500/20 bg-cyan-950/20 px-2 py-0.5">
                    {project.type}
                  </div>
                  <p className="font-mono text-xs text-white/50 leading-relaxed min-h-[50px] mb-3">
                    {project.description}
                  </p>
                </div>

                {/* Target Locking System Display */}
                {project.image ? (
                  <div className="w-full aspect-[2.1/1] rounded-none overflow-hidden border border-cyan-500/20 mb-4 relative group/img pointer-events-none">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover grayscale-[30%] group-hover/img:grayscale-0 transition-all duration-300" />
                    <div className="absolute inset-0 bg-cyan-400/5 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-x-0 h-px bg-cyan-400/40 pointer-events-none"
                         style={{ animation: 'scan 4s linear infinite' }} />
                  </div>
                ) : (
                  <div className="relative w-full aspect-[2.4/1] bg-black/80 border border-cyan-500/10 mb-4 overflow-hidden flex items-center justify-center">
                    {/* Scanning grid */}
                    <div className="absolute inset-0 opacity-[0.07]" 
                         style={{
                           backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
                           backgroundSize: '10px 10px'
                         }} 
                    />
                    
                    {/* Sweep scanner line */}
                    <div className="absolute inset-x-0 h-px bg-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.8)] pointer-events-none"
                         style={{
                           animation: 'scan 4s linear infinite',
                         }}
                    />
                    
                    {/* Radar concentric circles */}
                    <div className="absolute w-20 h-20 rounded-full border border-cyan-500/10 flex items-center justify-center">
                      <div className="absolute w-12 h-12 rounded-full border border-cyan-500/15 flex items-center justify-center">
                        <div className="absolute w-6 h-6 rounded-full border border-cyan-500/20" />
                      </div>
                    </div>

                    {/* Center Crosshairs */}
                    <div className="absolute w-4 h-px bg-cyan-400/30" />
                    <div className="absolute h-4 w-px bg-cyan-400/30" />

                    {/* Rotating radar sweep ray */}
                    <motion.div 
                      className="absolute w-32 h-32 origin-center border-r border-cyan-500/30 rounded-full bg-gradient-to-tr from-transparent via-cyan-500/0 to-cyan-500/10 opacity-30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Floating status tags */}
                    <div className="absolute top-2 left-2 font-mono text-[8px] text-cyan-400/60 flex flex-col gap-0.5">
                      <span>TGT_COORD: {project.id === 1 ? '16.5667° N' : '81.5167° E'}</span>
                      <span>SYS_VAL: 0x7F2B0{project.id}</span>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 font-mono text-[8px] text-cyan-400/60 flex flex-col items-end gap-0.5">
                      <span>LOCK_ON: TRUE</span>
                      <span className="text-[7px] text-cyan-300 font-bold bg-cyan-950/40 px-1 border border-cyan-500/20 animate-pulse">GATEWAY_READY</span>
                    </div>

                    {/* Live coordinate tracking overlay */}
                    <div className="absolute top-2 right-2 font-mono text-[8px] text-cyan-400/30">
                      ALT: {project.id === 1 ? '4812m' : '7891m'}
                    </div>
                  </div>
                )}

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] px-2 py-0.5 rounded-none bg-cyan-950/10 border border-cyan-500/20 text-cyan-300/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action and Mini telemetry */}
              <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                {/* Telemetry charts simulation */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[9px] text-white/30">
                    <span>CPU_ALLOCATION</span>
                    <span className="text-cyan-400 font-semibold">{isHovered ? '42%' : '12%'}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${project.gradient}`}
                      initial={{ width: '15%' }}
                      animate={{ width: isHovered ? '42%' : '12%' }}
                      transition={{ type: 'spring', stiffness: 80 }}
                    />
                  </div>
                </div>

                {/* Launch Button */}
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-none overflow-hidden relative group/btn pointer-events-auto cursor-pointer border border-cyan-500/30 bg-black/60 hover:bg-cyan-950/20 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400" />
                  <span className="font-mono text-xs font-bold tracking-wider text-cyan-400 flex items-center gap-2 group-hover/btn:text-cyan-300">
                    CONNECT GATEWAY
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                </motion.a>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Pending buffer info */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-2 font-mono text-[9px] text-cyan-400/40 bg-cyan-950/10 px-3 py-1 rounded-none border border-cyan-500/10">
          <Network className="w-3 h-3 text-cyan-500/50" />
          <span>INDEXER_BUFFER: PENDING_ADDITIONAL_MODULE_REPOS</span>
        </div>
      </div>
    </div>
  );
}
