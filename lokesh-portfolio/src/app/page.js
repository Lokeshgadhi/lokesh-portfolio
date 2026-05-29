'use client';

import { useState, useEffect }    from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import CustomCursor      from '@/components/ui/CustomCursor';
import Navigation         from '@/components/ui/Navigation';
import AtmosphereTracker  from '@/components/ui/AtmosphereTracker';

import BootSequence       from '@/components/sections/BootSequence';
import TerminalConsole    from '@/components/sections/TerminalConsole';
import HeroSection        from '@/components/sections/HeroSection';
import NeuralBrainSection from '@/components/sections/NeuralBrainSection';
import TimelineSection    from '@/components/sections/TimelineSection';
import ProjectsSection    from '@/components/sections/ProjectsSection';
import LifestyleSection   from '@/components/sections/LifestyleSection';
import VisionSection      from '@/components/sections/VisionSection';

import { ScrollProvider, useScroll } from '@/context/ScrollContext';

const GlobalCanvas = dynamic(
  () => import('@/components/three/GlobalCanvas'),
  { ssr: false },
);

// Cinematic entrance — each section materialises as it scrolls into view
function SceneLayer({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      transition={{
        duration: 1.6,
        delay,
        ease: [0.16, 1, 0.30, 1],
      }}
      viewport={{ once: true, margin: '-80px' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// ─── Main app shell ───────────────────────────────────────────────────────────
function MainContent({ consoleOpen, onToggleConsole, onCloseConsole }) {
  const { scrollProgress, scrollVelocity, scrollToSection, activeSection } = useScroll();

  return (
    <main className="relative w-full bg-[#030303]">
      <AtmosphereTracker />
      <Navigation onToggleConsole={onToggleConsole} />

      <AnimatePresence>
        {consoleOpen && (
          <TerminalConsole isOpen={consoleOpen} onClose={onCloseConsole} />
        )}
      </AnimatePresence>

      {/* Fixed 3D canvas — reacts to live scroll progress */}
      <GlobalCanvas
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
      />

      {/* ── Cinematic scroll progress rail ── */}
      <div className="fixed right-0 top-0 bottom-0 w-[2px] z-40 pointer-events-none">
        <div
          className="w-full bg-gradient-to-b from-cyan-500/60 via-cyan-400/40 to-transparent transition-all"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ── Section counter HUD ── */}
      <div className="fixed bottom-8 right-8 z-40 pointer-events-none flex flex-col items-end gap-1">
        <span className="font-mono text-[9px] text-cyan-500/50 tracking-[0.25em]">
          MEMORY_LAYER
        </span>
        <span className="font-mono text-[11px] text-cyan-400/70 tracking-widest font-bold">
          {String(activeSection + 1).padStart(2, '0')} ·· 06
        </span>
      </div>

      {/* ── Scrollable section stack ── */}
      <div className="relative z-10">

        {/* ── 00 · HERO ── */}
        <section
          id="hero"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 pt-28 pb-20"
        >
          <HeroSection onNext={() => scrollToSection(1)} />
        </section>

        {/* ── 01 · SKILLS ── */}
        <section
          id="skills"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24"
        >
          <SceneLayer>
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-[#0a0a0a]/80 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-cyan-500/25 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
                <NeuralBrainSection />
              </div>
            </div>
          </SceneLayer>
        </section>

        {/* ── 02 · PROJECTS ── */}
        <section
          id="projects"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24"
        >
          <SceneLayer>
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-[#0a0a0a]/80 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-purple-500/25 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/25 to-transparent pointer-events-none" />
                <ProjectsSection />
              </div>
            </div>
          </SceneLayer>
        </section>

        {/* ── 03 · TIMELINE ── */}
        <section
          id="timeline"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24"
        >
          <SceneLayer>
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-[#0a0a0a]/80 border border-white/[0.06] p-6 md:p-10 rounded-2xl relative overflow-hidden hover:border-purple-500/25 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <TimelineSection />
              </div>
            </div>
          </SceneLayer>
        </section>

        {/* ── 04 · LIFESTYLE ── */}
        <section
          id="lifestyle"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24"
        >
          <SceneLayer>
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-[#0a0a0a]/80 border border-white/[0.06] p-6 md:p-8 rounded-2xl relative overflow-hidden hover:border-emerald-500/25 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
                <LifestyleSection />
              </div>
            </div>
          </SceneLayer>
        </section>

        {/* ── 05 · CONTACT / VISION ── */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center px-6 md:px-12 py-24"
        >
          <SceneLayer>
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-[#0a0a0a]/80 border border-white/[0.06] p-6 md:p-8 rounded-2xl relative overflow-hidden hover:border-purple-500/25 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
                <VisionSection />
              </div>
            </div>
          </SceneLayer>
        </section>

      </div>
    </main>
  );
}

// ─── Root — handles boot + console state ─────────────────────────────────────
export default function Home() {
  const [isBooted, setIsBooted]       = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);

  // Skip boot sequence for returning visitors within the same browser session
  useEffect(() => {
    if (sessionStorage.getItem('booted') === '1') setIsBooted(true);
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('booted', '1');
    setIsBooted(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`') { e.preventDefault(); setConsoleOpen((p) => !p); }
      if (e.key === 'Escape' && consoleOpen) setConsoleOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [consoleOpen]);

  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {!isBooted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {isBooted && (
        <ScrollProvider>
          <MainContent
            consoleOpen={consoleOpen}
            onToggleConsole={() => setConsoleOpen((p) => !p)}
            onCloseConsole={() => setConsoleOpen(false)}
          />
        </ScrollProvider>
      )}
    </>
  );
}
