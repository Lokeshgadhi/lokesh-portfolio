'use client';

import {
  createContext, useContext, useEffect,
  useRef, useState, useCallback,
} from 'react';
import Lenis from 'lenis';

export const SECTIONS = [
  { id: 'hero',      label: 'BOOT',      color: '#06b6d4' },
  { id: 'skills',    label: 'SKILLS',    color: '#06b6d4' },
  { id: 'projects',  label: 'PROJECTS',  color: '#a855f7' },
  { id: 'timeline',  label: 'TIMELINE',  color: '#a855f7' },
  { id: 'lifestyle', label: 'LIFESTYLE', color: '#10b981' },
  { id: 'contact',   label: 'CONTACT',   color: '#a855f7' },
];

const Ctx = createContext(null);

export function ScrollProvider({ children }) {
  const [activeSection, setActiveSection]   = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [transitioning, setTransitioning]   = useState(false);

  const lenisRef        = useRef(null);
  const rafRef          = useRef(null);
  const prevSection     = useRef(0);
  const transitionTimer = useRef(null);

  // ── Lenis initialisation ─────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      // lerp-based: feels organic and heavy — like a camera dolly decelerating
      lerp: 0.055,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.4,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress, velocity }) => {
      setScrollProgress(progress);
      setScrollVelocity(velocity);
    });

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  // ── Section detection — trigger when section crosses viewport midline ────────
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(i);
            if (prevSection.current !== i) {
              clearTimeout(transitionTimer.current);
              setTransitioning(true);
              transitionTimer.current = setTimeout(() => setTransitioning(false), 700);
              prevSection.current = i;
            }
          }
        },
        // Fires when section crosses the middle 20% band of the viewport
        { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((index) => {
    const s = SECTIONS[index];
    if (!s || !lenisRef.current) return;
    const el = document.getElementById(s.id);
    if (!el) return;
    lenisRef.current.scrollTo(el, {
      offset:  0,
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  return (
    <Ctx.Provider value={{
      activeSection,
      active:       activeSection,   // compat alias
      scrollProgress,
      scrollVelocity,
      transitioning,
      scrollToSection,
      goTo:      scrollToSection,    // compat alias
      direction: 1,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useScroll() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useScroll must be inside ScrollProvider');
  return ctx;
}

// Backwards-compat hook so existing components don't need changing
export function useSectionTransition() {
  return useScroll();
}
