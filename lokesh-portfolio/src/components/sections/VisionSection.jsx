'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '@/data/personal';
import { Sparkles, Plane, Crown, Mail, Github, Linkedin, Send } from 'lucide-react';
import useGlitchText from '@/lib/useGlitchText';

const visionIcons = {
  'Financial Freedom': Crown,
  'Luxury Lifestyle': Sparkles,
  'Travel The World': Plane,
};

export default function VisionSection() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  // Glitch text hook
  const visionHeader = useGlitchText('LAYER_05 // FINAL_TRANSMISSION', 25, 8);

  const contactDetails = [
    { label: 'EMAIL', value: 'lokesh.kumar.g.dev@gmail.com', icon: Mail, href: 'mailto:lokesh.kumar.g.dev@gmail.com' },
    { label: 'GITHUB', value: 'github.com/lokeshkumar-g', icon: Github, href: 'https://github.com/lokeshkumar-g' },
    { label: 'LINKEDIN', value: 'linkedin.com/in/lokesh-kumar-g', icon: Linkedin, href: 'https://www.linkedin.com/in/lokesh-kumar-g' },
  ];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none py-6 md:py-10">
      
      {/* 1. Header & Vision Pillars */}
      <div className="space-y-6 w-full text-center">
        <div className="inline-block bg-black/60 px-4 py-1.5 border border-cyan-500/20 rounded-none relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            {visionHeader}
          </span>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto px-4">
          {personalData.vision.map((goal, idx) => {
            const Icon = visionIcons[goal] || Sparkles;
            return (
              <div
                key={goal}
                className="bg-black/85 p-4 border border-cyan-500/25 flex flex-col items-center justify-center text-center space-y-2 group hover:border-cyan-400 transition-all duration-300 rounded-none relative shadow-[0_0_15px_rgba(6,182,212,0.02)]"
              >
                {/* Cyber brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/40" />
                
                <div className="w-10 h-10 rounded-none bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 relative">
                  <Icon className="w-5 h-5" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-none blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs md:text-sm text-white/90 truncate max-w-full">
                    {goal}
                  </h4>
                  <span className="font-mono text-[8px] text-white/30 uppercase block mt-0.5">
                    PILLAR_0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bold Final Quote Statement */}
      <div className="text-center my-6">
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="font-mono text-[9px] text-cyan-400 tracking-[0.4em] uppercase mb-4"
        >
          ━━━━━ CORE TRANSMISSION STATUS: ACTIVE ━━━━━
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none">
          <span className="block text-white/90">This is only</span>
          <span className="block gradient-text">the beginning.</span>
        </h2>
      </div>

      {/* 3. Interactive Contact Terminal Module */}
      <div className="w-full max-w-md mx-auto z-20 pointer-events-auto">
        <AnimatePresence mode="wait">
          {!terminalOpen ? (
            <motion.div
              key="gateway-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <motion.button
                onClick={() => setTerminalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-3 rounded-none overflow-hidden group border border-cyan-500/30 bg-black/60 hover:bg-cyan-950/20 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.05)] cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400" />
                <span className="relative font-display font-bold text-xs tracking-[0.15em] text-cyan-300 group-hover:text-cyan-200 flex items-center gap-2">
                  ESTABLISH SECURE LINK
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="terminal-box"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-black/90 border border-cyan-500/25 p-5 rounded-none relative border-l-4 border-l-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)] font-mono text-xs text-left overflow-hidden"
            >
              {/* Cyber notches */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/50" />

              {/* Header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-cyan-500/10 mb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  <span>SECURE_CONNECTION_ESTABLISHED</span>
                </div>
                <button
                  onClick={() => setTerminalOpen(false)}
                  className="text-white/40 hover:text-cyan-400 font-bold focus:outline-none cursor-pointer"
                >
                  [X]
                </button>
              </div>

              {/* Console logs */}
              <div className="space-y-3.5">
                <div className="text-white/40">&gt; querying digital coordinates... ok</div>
                {contactDetails.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <div key={contact.label} className="flex items-center justify-between gap-3 bg-cyan-950/10 border border-cyan-500/10 p-2.5 rounded-none relative hover:border-cyan-400 transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-400/20" />
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-purple-400 font-bold text-[10px] block leading-none mb-1">
                            {contact.label}
                          </span>
                          <a
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-cyan-300 font-semibold truncate block text-xs hover:underline"
                          >
                            {contact.value}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(contact.value, contact.label)}
                        className="text-[9px] font-mono text-cyan-400/60 hover:text-cyan-300 border border-cyan-500/20 px-2 py-1 rounded-none bg-black/40 hover:bg-cyan-950/20 cursor-pointer focus:outline-none"
                      >
                        {copiedText === contact.label ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Footer credits */}
      <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-mono text-white/30 border-t border-white/5 pt-4 mt-4 w-full">
        <div>© 2026 LOKESH.SYSTEM // ALL TIMELINES ACTIVE</div>
        <div className="text-cyan-400/40 mt-1 md:mt-0 uppercase tracking-widest">
          Transmitting through infinite loops
        </div>
      </div>
    </div>
  );
}
