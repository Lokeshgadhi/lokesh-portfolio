'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Global UI Assets
import CustomCursor from '@/components/ui/CustomCursor';
import Navigation from '@/components/ui/Navigation';

// Persistent Background WebGL Canvas
import GlobalCanvas from '@/components/three/GlobalCanvas';

// System Scene Manager & Boot sequences
import BootSequence from '@/components/sections/BootSequence';
import TerminalConsole from '@/components/sections/TerminalConsole';

// Scene content overlays
import HeroSection from '@/components/sections/HeroSection';
import NeuralBrainSection from '@/components/sections/NeuralBrainSection';
import TimelineSection from '@/components/sections/TimelineSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import LifestyleSection from '@/components/sections/LifestyleSection';
import VisionSection from '@/components/sections/VisionSection';

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track window scroll progress for WebGL backdrop parallax
  useEffect(() => {
    if (!isBooted) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBooted]);

  // Global hotkey listener for tilde `~` console drawer
  useEffect(() => {
    const handleHotkey = (e) => {
      if (e.key === '`') {
        e.preventDefault();
        setConsoleOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && consoleOpen) {
        setConsoleOpen(false);
      }
    };
    window.addEventListener('keydown', handleHotkey);
    return () => window.removeEventListener('keydown', handleHotkey);
  }, [consoleOpen]);

  const handleScrollToNext = () => {
    const el = document.getElementById('skills');
    if (el) {
      const offset = 90;
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
    <>
      <CustomCursor />

      {/* Terminal Command Console Overlay */}
      <AnimatePresence>
        {consoleOpen && (
          <TerminalConsole isOpen={consoleOpen} onClose={() => setConsoleOpen(false)} />
        )}
      </AnimatePresence>

      {/* 1. Terminal Boot Loading Sequence */}
      <AnimatePresence mode="wait">
        {!isBooted && (
          <BootSequence onComplete={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      {/* 2. Main Bento Grid Experience (rendered once system is booted) */}
      {isBooted && (
        <main className="relative min-h-screen w-full bg-[#030303]">
          {/* Top navigation overlay */}
          <Navigation
            onToggleConsole={() => setConsoleOpen((prev) => !prev)}
          />

          {/* Persistent global background WebGL canvas (pinned fixed backdrop) */}
          <GlobalCanvas scrollProgress={scrollProgress} />

          {/* Bento Grid Content Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-20 space-y-16">
            
            {/* ─── Hero Block (Full height landing header) ─── */}
            <section id="boot" className="min-h-[80vh] flex items-center justify-center">
              <HeroSection onNext={handleScrollToNext} />
            </section>

            {/* ─── Bento Grid Dashboard ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
              
              {/* Box 1: Skills Mind Map (Full width) */}
              <div id="skills" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
                <NeuralBrainSection />
              </div>

              {/* Box 2: Projects Showcase (Full width) */}
              <div id="projects" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <ProjectsSection />
              </div>

              {/* Box 3: Experience Origin Timeline (Full width) */}
              <div id="experience" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <TimelineSection />
              </div>

              {/* Box 4: Lifestyle Stats (Full width) */}
              <div id="lifestyle" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-8 rounded-2xl relative overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <LifestyleSection />
              </div>

              {/* Box 5: Contact Gateway (Full width) */}
              <div id="contact" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-8 rounded-2xl relative overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <VisionSection />
              </div>

            </div>
          </div>
        </main>
      )}
    </>
  );
}
