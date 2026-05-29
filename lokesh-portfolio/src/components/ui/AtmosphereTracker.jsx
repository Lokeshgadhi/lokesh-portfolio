'use client';

import { useEffect, useRef } from 'react';
import { useScroll } from '@/context/ScrollContext';
import { useAtmosphereStore } from '@/stores/atmosphereStore';

// Renders nothing — bridges ScrollContext → atmosphereStore
// and manages idle-state detection for the whole page.
export default function AtmosphereTracker() {
  const { activeSection } = useScroll();
  const setActiveSection  = useAtmosphereStore((s) => s.setActiveSection);
  const setIdleState      = useAtmosphereStore((s) => s.setIdleState);

  const idleTimer = useRef(null);
  const IDLE_DELAY_MS = 3200; // ms before AI enters dormant state

  // ── Sync section index from Lenis scroll → store ─────────────────────────
  useEffect(() => {
    setActiveSection(activeSection);
  }, [activeSection, setActiveSection]);

  // ── Idle detection ────────────────────────────────────────────────────────
  useEffect(() => {
    function onActivity() {
      clearTimeout(idleTimer.current);
      setIdleState(false);

      idleTimer.current = setTimeout(() => {
        setIdleState(true);
      }, IDLE_DELAY_MS);
    }

    const events = ['mousemove', 'wheel', 'keydown', 'touchmove', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    // Initialise the timer (consider idle on mount after delay)
    onActivity();

    return () => {
      clearTimeout(idleTimer.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [setIdleState]);

  return null;
}
