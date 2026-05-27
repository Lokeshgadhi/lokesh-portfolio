'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Globe } from 'lucide-react';
import { personalData } from '@/data/personal';

export default function OriginSection() {
  const [stage, setStage] = useState(0); // 0: intro, 1: calendar, 2: earth, 3: revealed

  const handleReveal = () => {
    setStage(1);
    setTimeout(() => setStage(2), 2500);
    setTimeout(() => setStage(3), 5000);
  };

  const reset = () => setStage(0);

  return (
    <section id="origin" className="relative min-h-screen w-full py-32 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      {/* Stars background when revealed */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass rounded-full px-4 py-1.5 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
              Section 02 / Origin Story
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            <span className="gradient-text">The Origin</span>
          </h2>
          <p className="font-mono text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Every story has a beginning. Discover where this journey started.
          </p>
        </motion.div>

        {/* Main interactive area */}
        <div className="min-h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* Stage 0: Initial state */}
            {stage === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.button
                  onClick={handleReveal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-6 overflow-hidden rounded-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-[2px] bg-black rounded-full" />
                  <div className="relative flex items-center gap-4">
                    <Globe className="w-6 h-6 text-cyan-400" />
                    <span className="font-display font-bold text-xl gradient-text">
                      Know My Origin
                    </span>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity -z-10" />
                </motion.button>
                <p className="font-mono text-xs text-white/40 mt-6 tracking-wider">
                  CLICK TO BEGIN THE JOURNEY
                </p>
              </motion.div>
            )}

            {/* Stage 1: Calendar flip */}
            {stage === 1 && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-80 h-96 perspective-1000">
                  {/* Calendar */}
                  <motion.div
                    animate={{ rotateY: [0, 180, 360, 540, 720] }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 glass-strong rounded-3xl p-8 border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
                      <div className="flex items-center justify-between mb-6">
                        <Calendar className="w-8 h-8 text-cyan-400" />
                        <div className="font-mono text-xs text-cyan-400 tracking-widest">
                          ARCHIVE.SYS
                        </div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-center"
                      >
                        <div className="font-mono text-sm text-white/60 mb-2">
                          {personalData.birth.month.toUpperCase()}
                        </div>
                        <div className="font-display text-9xl font-bold text-transparent bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text">
                          {personalData.birth.date}
                        </div>
                        <div className="font-mono text-2xl text-white/80 mt-2">
                          {personalData.birth.year}
                        </div>
                      </motion.div>

                      {/* Glowing pulse */}
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-4 border-cyan-400 rounded-3xl"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-center mt-8 font-mono text-cyan-400 tracking-wider"
                >
                  TIME LOCKED: {personalData.birth.fullDate}
                </motion.p>
              </motion.div>
            )}

            {/* Stage 2: Earth */}
            {stage === 2 && (
              <motion.div
                key="earth"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.5 }}
                className="text-center"
              >
                <div className="relative w-80 h-80 mx-auto">
                  {/* Earth */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #1e3a8a, #0c1e4e, #000)',
                      boxShadow: '0 0 100px rgba(59, 130, 246, 0.5), inset 0 0 80px rgba(0,0,0,0.8)',
                    }}
                  >
                    {/* Continents (simplified) */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-green-700/40 rounded-full blur-sm"
                          style={{
                            width: `${20 + Math.random() * 30}%`,
                            height: `${15 + Math.random() * 20}%`,
                            left: `${Math.random() * 70}%`,
                            top: `${Math.random() * 70}%`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Latitude lines */}
                    {[0, 30, 60, 90, 120, 150].map((rotation) => (
                      <div
                        key={rotation}
                        className="absolute inset-0 rounded-full border border-cyan-400/20"
                        style={{ transform: `rotateX(${rotation}deg)` }}
                      />
                    ))}
                  </motion.div>

                  {/* Orbit rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-orbit" />
                  <div className="absolute inset-[-20px] rounded-full border border-purple-400/20" 
                       style={{ animation: 'orbit 30s linear infinite reverse' }} />
                  
                  {/* Location pulse */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute top-[45%] left-[55%]"
                  >
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    </div>
                  </motion.div>

                  {/* Glow */}
                  <div className="absolute inset-[-40px] bg-cyan-500/20 rounded-full blur-3xl -z-10" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="mt-12 space-y-2"
                >
                  <p className="font-mono text-xs text-cyan-400 tracking-[0.3em] uppercase">
                    Coordinates Acquired
                  </p>
                  <p className="font-display text-2xl text-white/90">
                    {personalData.birth.coordinates.lat}°N, {personalData.birth.coordinates.lng}°E
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Stage 3: Final reveal */}
            {stage === 3 && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-center max-w-3xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-70" />
                  <div className="relative w-full h-full bg-black rounded-full border-2 border-cyan-500/50 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-cyan-400" />
                  </div>
                </motion.div>

                <h3 className="font-display text-4xl md:text-6xl font-bold mb-6 gradient-text">
                  Where the journey started.
                </h3>

                <div className="glass-strong rounded-3xl p-8 mt-12 max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-6 text-left">
                    <div>
                      <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
                        Date of Origin
                      </div>
                      <div className="font-display text-2xl font-bold">
                        {personalData.birth.date} {personalData.birth.month} {personalData.birth.year}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
                        Country
                      </div>
                      <div className="font-display text-2xl font-bold">
                        {personalData.birth.country}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
                        State
                      </div>
                      <div className="font-display text-xl font-bold">
                        {personalData.birth.state}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase mb-2">
                        Birthplace
                      </div>
                      <div className="font-display text-xl font-bold">
                        {personalData.birth.place}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="mt-12 font-mono text-xs text-white/40 hover:text-cyan-400 tracking-widest uppercase transition-colors"
                >
                  ⟲ Replay sequence
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
