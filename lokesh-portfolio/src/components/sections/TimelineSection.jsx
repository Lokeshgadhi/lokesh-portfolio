'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '@/data/personal';
import { Compass, Calendar, MapPin, Milestone, History } from 'lucide-react';
import useGlitchText from '@/lib/useGlitchText';

export default function TimelineSection() {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  const mainTitle = useGlitchText('The Origin Core', 20, 10);
  const registryHeader = useGlitchText('ORIGIN_TIMESTAMP', 25, 8);

  return (
    <div className="w-full h-full flex flex-col md:grid md:grid-cols-12 gap-8 items-center justify-center select-none py-10 md:py-0">
      
      {/* Left Pane: System Origin Registry */}
      <div className="col-span-12 md:col-span-5 space-y-6 text-left w-full z-30">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 glass px-4 py-1.5 rounded-full border border-cyan-500/20">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              LAYER_02 // SYSTEM_ORIGIN
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-none text-white">
            {mainTitle}
          </h2>

          <p className="font-mono text-xs text-white/50 leading-relaxed max-w-sm">
            Coordinates of physical deployment and initial activation parameters. System locked on West Godavari, Andhra Pradesh.
          </p>
        </div>

        {/* Origin Spec Sheet Card - Blueprint style */}
        <div className="relative bg-black/75 border border-cyan-500/20 p-6 space-y-4 w-full max-w-md border-l-4 border-l-cyan-400 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/50" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/50" />
          
          <div className="flex items-center gap-2.5 pb-3 border-b border-cyan-500/10">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              {registryHeader}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">INITIALIZATION</span>
              <span className="font-display font-bold text-lg text-white">
                {personalData.birth.date} {personalData.birth.month}
              </span>
            </div>
            <div>
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">CYCLE_YEAR</span>
              <span className="font-display font-bold text-lg text-white">
                {personalData.birth.year}
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">COORD_MATRIX</span>
              <span className="font-mono text-xs text-cyan-300 font-semibold block">
                {personalData.birth.coordinates.lat}° N / {personalData.birth.coordinates.lng}° E
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">DEPLOYMENT_SITE</span>
              <span className="font-display text-xs text-white/80 block leading-tight">
                {personalData.birth.place}, {personalData.birth.state}, {personalData.birth.country}
              </span>
            </div>
          </div>

          {/* Location status node */}
          <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/20 px-3 py-1.5 rounded-lg border border-cyan-500/10">
            <MapPin className="w-3.5 h-3.5" />
            <span>GEO_INDEX_MATCH: WEST_GODAVARI_AP</span>
          </div>
        </div>
      </div>

      {/* Right Pane: Memory Log Buffer (Timeline milestones) */}
      <div className="col-span-12 md:col-span-7 w-full space-y-6">
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-purple-400" />
          <h3 className="font-mono text-xs font-bold text-purple-400 tracking-[0.2em] uppercase">
            MEMORY_LOG_BUFFER
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
        </div>

        {/* Milestone logs list */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
          {personalData.timeline.map((event, idx) => {
            const isSelected = selectedMilestone === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setSelectedMilestone(idx)}
                onClick={() => setSelectedMilestone(idx)}
                className={`p-4 border transition-all duration-300 flex items-center gap-4 cursor-pointer text-left rounded-none relative ${
                  isSelected
                    ? 'border-cyan-500/30 bg-cyan-950/20 border-l-4 border-l-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'border-white/5 bg-black/30 hover:border-cyan-500/20 hover:bg-white/2'
                }`}
              >
                {/* Visual anchor notch */}
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400/40 opacity-40" />

                {/* Milestone Icon */}
                <div className="text-2xl flex-shrink-0 bg-black/40 w-11 h-11 rounded-none flex items-center justify-center border border-white/10">
                  {event.icon}
                </div>

                {/* Milestone text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[9px] text-cyan-400 font-semibold tracking-widest">
                      LOG_ENTRY_0{idx + 1}
                    </span>
                    <span className="font-display font-bold text-xs text-cyan-400">
                      {event.year}
                    </span>
                  </div>
                  <h4 className="font-display font-medium text-xs md:text-sm text-white/95 truncate leading-snug">
                    {event.event}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current milestone terminal panel */}
        <div className="relative bg-black/50 border border-cyan-500/15 p-4 rounded-none border-l-4 border-l-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
          {/* Visual anchor notch */}
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-purple-400/40 opacity-40" />
          
          <div className="flex items-center gap-2 mb-2 font-mono text-[9px] text-white/30">
            <Milestone className="w-3.5 h-3.5 text-purple-400" />
            <span>BUFFER_INDEX_0{selectedMilestone + 1} // CACHED_EVENT_LOG</span>
          </div>
          <p className="font-mono text-xs text-cyan-300/90 leading-relaxed">
            &gt; Selected log thread verified: &ldquo;{personalData.timeline[selectedMilestone].event}&rdquo; verified in epoch {personalData.timeline[selectedMilestone].year}. System optimization successfully recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
