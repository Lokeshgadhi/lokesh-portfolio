import { create } from 'zustand';

// Per-section mood multipliers applied to every atmospheric element.
// Values are relative (1.0 = default). Designed to feel distinct but never jarring.
export const SECTION_MOODS = [
  // 0 · HERO — awakening void, consciousness booting
  { particleM: 0.42, streamM: 0.35, pulseM: 0.52, holoM: 0.75, raysM: 0.62, structM: 0.38 },
  // 1 · SKILLS — precision neural matrix, structured signal flow
  { particleM: 1.05, streamM: 2.00, pulseM: 0.92, holoM: 1.00, raysM: 0.78, structM: 1.25 },
  // 2 · PROJECTS — holographic archive scan, database activation
  { particleM: 1.30, streamM: 1.05, pulseM: 1.45, holoM: 1.55, raysM: 1.35, structM: 1.55 },
  // 3 · TIMELINE — memory resonance, slower ambient pacing
  { particleM: 0.60, streamM: 0.70, pulseM: 0.55, holoM: 0.62, raysM: 0.88, structM: 0.72 },
  // 4 · LIFESTYLE — alive, organic, vibrant
  { particleM: 1.52, streamM: 0.88, pulseM: 1.68, holoM: 1.08, raysM: 1.55, structM: 0.98 },
  // 5 · CONTACT — transmission endpoint, fading signal
  { particleM: 0.36, streamM: 0.40, pulseM: 0.28, holoM: 0.50, raysM: 0.38, structM: 0.44 },
];

export const useAtmosphereStore = create((set) => ({
  activeSection: 0,
  isIdle:        false,
  idleStartTime: null,   // Date.now() when idle started; null when active

  setActiveSection: (i)     => set({ activeSection: i }),
  setIdleState:     (idle)  => set({
    isIdle:        idle,
    idleStartTime: idle ? Date.now() : null,
  }),
}));

// Utility — call inside useFrame for zero-cost idle seconds (no subscription)
export function computeIdleSeconds(isIdle, idleStartTime) {
  if (!isIdle || !idleStartTime) return 0;
  return (Date.now() - idleStartTime) / 1000;
}

// Exponential idle multiplier: 1.0 when active → ~0.15 after ~30s idle
export function idleMultiplier(idleSecs) {
  return Math.max(0.15, Math.exp(-idleSecs * 0.075));
}
