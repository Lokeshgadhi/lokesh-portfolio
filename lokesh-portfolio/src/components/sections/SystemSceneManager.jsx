'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Eye, Clock, Shield, Database, Award, ArrowDown } from 'lucide-react';

const SCENE_NAMES = [
  { id: 0, num: '00', label: 'BOOT', title: 'SYSTEM_HERO_LOAD' },
  { id: 1, num: '01', label: 'CONSCIOUSNESS', title: 'NEURAL_MIND_GRID' },
  { id: 2, num: '02', label: 'MEMORY', title: 'HISTORICAL_TIMELINE' },
  { id: 3, num: '03', label: 'SYSTEMS', title: 'DEVELOPER_BUILDS' },
  { id: 4, num: '04', label: 'HUMANITY', title: 'DISCIPLINE_PRINCIPLES' },
  { id: 5, num: '05', label: 'TRANSMISSION', title: 'VISIONARY_FUTURE' },
];

export default function SystemSceneManager({
  activeScene,
  setActiveScene,
  renderHero,
  renderMind,
  renderTimeline,
  renderProjects,
  renderLifestyle,
  renderVision,
}) {
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const [dialRotation, setDialRotation] = useState(0);

  // Mousemove listener to rotate the HUD compass dial
  useEffect(() => {
    const handleMove = (e) => {
      const deg = (e.clientX / window.innerWidth) * 180; // slow rotation
      setDialRotation(deg);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Scene transition handler with safety cooldown
  const transitionToScene = (nextScene) => {
    if (nextScene < 0 || nextScene >= SCENE_NAMES.length || isTransitioning.current) return;
    
    isTransitioning.current = true;
    setActiveScene(nextScene);

    // 1.2s cooldown to align with the camera lerp speed
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1200);
  };

  // 1. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        transitionToScene(activeScene + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault();
        transitionToScene(activeScene - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScene]);

  // 2. Mouse Wheel Navigation
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't intercept scrolling if user is inside an auto-scrollable sub-card
      const scrollableElement = e.target.closest('.overflow-y-auto');
      if (scrollableElement) {
        const isScrollingDown = e.deltaY > 0;
        const isAtBottom = scrollableElement.scrollHeight - scrollableElement.scrollTop <= scrollableElement.clientHeight + 1;
        const isAtTop = scrollableElement.scrollTop === 0;

        if (isScrollingDown && !isAtBottom) return; // let them scroll the element down
        if (!isScrollingDown && !isAtTop) return; // let them scroll the element up
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < 15) return; // threshold

      if (e.deltaY > 0) {
        transitionToScene(activeScene + 1);
      } else {
        transitionToScene(activeScene - 1);
      }
    };

    // Add passive false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeScene]);

  // 3. Touch Swipe Navigation
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY.current - touchEndY;

      // scrollable check for mobile swipe
      const scrollableElement = e.target.closest('.overflow-y-auto');
      if (scrollableElement) {
        const isSwipingUp = diffY > 0;
        const isAtBottom = scrollableElement.scrollHeight - scrollableElement.scrollTop <= scrollableElement.clientHeight + 1;
        const isAtTop = scrollableElement.scrollTop === 0;
        if (isSwipingUp && !isAtBottom) return;
        if (!isSwipingUp && !isAtTop) return;
      }

      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          transitionToScene(activeScene + 1); // Swipe Up -> Next
        } else {
          transitionToScene(activeScene - 1); // Swipe Down -> Prev
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeScene]);

  // Render current active layout
  const renderContent = () => {
    switch (activeScene) {
      case 0:
        return renderHero();
      case 1:
        return renderMind();
      case 2:
        return renderTimeline();
      case 3:
        return renderProjects();
      case 4:
        return renderLifestyle();
      case 5:
        return renderVision();
      default:
        return renderHero();
    }
  };

  return (
    <div className="relative w-screen h-screen z-10 pointer-events-none">
      
      {/* ─── Blueprint Decals Overlay ─── */}
      <div className="absolute left-[18%] top-0 bottom-0 w-px border-l border-dashed border-cyan-500/5 pointer-events-none" />
      <div className="absolute right-[18%] top-0 bottom-0 w-px border-r border-dashed border-cyan-500/5 pointer-events-none" />
      <div className="absolute top-[20%] left-0 right-0 h-px border-t border-dashed border-cyan-500/5 pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 right-0 h-px border-b border-dashed border-cyan-500/5 pointer-events-none" />

      {/* Screen Center Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden md:block">
        <div className="w-5 h-px bg-cyan-400" />
        <div className="h-5 w-px bg-cyan-400 -mt-2.5 ml-2.5" />
        <div className="font-mono text-[7px] text-cyan-400 absolute ml-4 -mt-3.5 tracking-wider">
          SYS_CTR_0,0
        </div>
      </div>

      {/* Rotating Telemetry Dial */}
      <div className="absolute top-20 right-10 pointer-events-none opacity-30 hidden md:block z-30">
        <svg
          width="36"
          height="36"
          viewBox="0 0 40 40"
          style={{ transform: `rotate(${dialRotation}deg)` }}
          className="transition-transform duration-200 ease-out"
        >
          <circle cx="20" cy="20" r="18" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="13" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          <line x1="20" y1="2" x2="20" y2="7" stroke="#06b6d4" strokeWidth="0.8" />
          <line x1="2" y1="20" x2="7" y2="20" stroke="#06b6d4" strokeWidth="0.8" />
        </svg>
      </div>

      {/* ─── Persistent Cyber HUD Border Overlay ─── */}
      <div className="absolute inset-0 border border-cyan-500/10 m-3 md:m-6 pointer-events-none rounded-2xl flex flex-col justify-between">
        
        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-xl pointer-events-none" />

        {/* HUD Grid Accents */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent pointer-events-none" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent pointer-events-none" />
        <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent pointer-events-none" />
        <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent pointer-events-none" />

        {/* Top bar metrics */}
        <div className="flex justify-between items-center px-6 py-4 font-mono text-[9px] text-cyan-400/60 z-30 pointer-events-auto">
          <div className="flex items-center gap-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">SYS_LOAD: 2.14%</span>
            <span>MEM: ALLOC_OK</span>
          </div>
          <div className="font-display font-medium text-xs tracking-[0.2em] text-white/40">
            {SCENE_NAMES[activeScene].title}
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>LAYER: 0{activeScene}</span>
          </div>
        </div>

        {/* Bottom bar credits / telemetry */}
        <div className="flex justify-between items-center px-6 py-4 font-mono text-[9px] text-cyan-400/40 z-30 pointer-events-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-3.5 h-3.5" />
            <span>LINK: ENCRYPTED</span>
          </div>
          <div className="hidden md:block">LOKESH_KUMAR_G // DIGITAL.MIND.INTERFACE</div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            <span>SECURE_SESSION</span>
          </div>
        </div>
      </div>

      {/* ─── Sidebar Layer Navigation Indicator ─── */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40 pointer-events-auto">
        {SCENE_NAMES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => transitionToScene(scene.id)}
            className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            {/* Dot index */}
            <div className="relative flex items-center justify-center w-3 h-3">
              <motion.div
                className={`rounded-full ${
                  activeScene === scene.id ? 'w-2 h-2 bg-cyan-400' : 'w-1 h-1 bg-white/20 group-hover:bg-white/60'
                } transition-all duration-300`}
                style={{
                  boxShadow: activeScene === scene.id ? '0 0 10px #06b6d4' : 'none',
                }}
              />
              {activeScene === scene.id && (
                <motion.div
                  layoutId="activeRing"
                  className="absolute w-4 h-4 rounded-full border border-cyan-400/40"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </div>

            {/* Label sliding on hover */}
            <span
              className={`font-mono text-[10px] tracking-widest hidden md:inline-block transition-all duration-300 ${
                activeScene === scene.id
                  ? 'text-cyan-400 font-bold translate-x-1'
                  : 'text-white/30 group-hover:text-white/70 group-hover:translate-x-1'
              }`}
            >
              {scene.num} // {scene.label}
            </span>
          </button>
        ))}
      </div>

      {/* ─── Scroll indicators (Bottom center) ─── */}
      {activeScene < SCENE_NAMES.length - 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center gap-1">
          <button
            onClick={() => transitionToScene(activeScene + 1)}
            className="flex flex-col items-center gap-1 group font-mono text-[9px] text-white/30 hover:text-cyan-400 uppercase tracking-[0.3em] transition-colors focus:outline-none cursor-pointer"
          >
            <span>SCROLL DOWN</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-all" />
          </button>
        </div>
      )}

      {/* ─── Main Content Viewport Slider ─── */}
      <div className="w-full h-full overflow-hidden flex items-center justify-center relative px-12 md:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="w-full max-w-6xl z-20 pointer-events-auto"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle CRT raster scanning line overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent h-10 w-full animate-scan z-10 pointer-events-none opacity-5"
           style={{
             animation: 'scan 8s linear infinite',
           }}
      />
    </div>
  );
}
