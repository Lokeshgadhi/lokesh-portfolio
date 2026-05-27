'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Global UI Assets
import CustomCursor from '@/components/ui/CustomCursor';
import Navigation from '@/components/ui/Navigation';

// Persistent Background WebGL Canvas — ssr:false prevents Three.js from
// being evaluated on the server where WebGL APIs don't exist.
const GlobalCanvas = dynamic(
  () => import('@/components/three/GlobalCanvas'),
  { ssr: false }
);

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
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {consoleOpen && (
          <TerminalConsole isOpen={consoleOpen} onClose={() => setConsoleOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isBooted && (
          <BootSequence onComplete={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      {isBooted && (
        <main className="relative min-h-screen w-full bg-[#030303]">
          <Navigation onToggleConsole={() => setConsoleOpen((prev) => !prev)} />

          <GlobalCanvas scrollProgress={scrollProgress} />

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-20 space-y-16">

            <section id="boot" className="min-h-[80vh] flex items-center justify-center">
              <HeroSection onNext={handleScrollToNext} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

              <div id="skills" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
                <NeuralBrainSection />
              </div>

              <div id="projects" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <ProjectsSection />
              </div>

              <div id="experience" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
                <TimelineSection />
              </div>

              <div id="lifestyle" className="col-span-12 w-full bg-[#0a0a0a]/70 border border-white/[0.06] p-6 md:p-8 rounded-2xl relative overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-[0_0_45px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <LifestyleSection />
              </div>

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
