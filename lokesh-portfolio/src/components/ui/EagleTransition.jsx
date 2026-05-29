'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionTransition } from '@/context/TransitionContext';

// ── Eagle silhouette — body at (0,0), head faces +x, wingspan ±680 ────────────
const WING_L  = 'M 0 0 C -126 -78 -345 -174 -680 -126 C -504 -45 -255 -12 0 27 Z';
const WING_R  = 'M 0 0 C  126 -78  345 -174  680 -126 C  504 -45  255 -12 0 27 Z';
const WING_L2 = 'M 0 0 C  -88 -44 -240 -120 -495 -90 C -360 -28 -175  -6 0 18 Z';
const WING_R2 = 'M 0 0 C   88 -44  240 -120  495 -90 C  360 -28  175  -6 0 18 Z';
const BODY    = 'M -28 -10 L 28 -10 L 44 5 L 28 20 L -28 20 L -44 5 Z';
const HEAD    = 'M 28 -10 L 68 -20 L 80 -2 L 68 14 L 28 20 Z';
const BEAK    = 'M 68 -20 L 96 -4 L 68 14 Z';
const TALONS  = 'M -12 20 L -36 58 M -22 46 L -14 64 M -36 58 L -42 72 M 12 20 L 36 58 M 22 46 L 14 64 M 36 58 L 42 72';

// ── Feather rays — radiate from body center to wing-tip landmarks ─────────────
// Each is a single line; glow filter turns them into soft fire beams
const FEATHERS = [
  { d: 'M -4 10 L -680 -126', w: 1.5, c: '#ff8c00' },
  { d: 'M -4  8 L -540 -148', w: 1.2, c: '#ff6a00' },
  { d: 'M -4  6 L -400 -154', w: 1.0, c: '#ff5500' },
  { d: 'M -4  5 L -260 -138', w: 0.9, c: '#ff6a00' },
  { d: 'M -4  4 L -130  -96', w: 0.8, c: '#ff8c00' },
  { d: 'M  4 10 L  680 -126', w: 1.5, c: '#ff8c00' },
  { d: 'M  4  8 L  540 -148', w: 1.2, c: '#ff6a00' },
  { d: 'M  4  6 L  400 -154', w: 1.0, c: '#ff5500' },
  { d: 'M  4  5 L  260 -138', w: 0.9, c: '#ff6a00' },
  { d: 'M  4  4 L  130  -96', w: 0.8, c: '#ff8c00' },
];

// ── Diagonal fire tear — single smooth line across the screen ─────────────────
const TEAR = 'M 1920 160 L 0 920';

// ── Ember particles — 11, near wing tips and body core ───────────────────────
const EMBERS = [
  { x: -652, y: -122, r: 1.8, c: '#ff8c00', d: 0.10 },
  { x: -490, y: -148, r: 1.5, c: '#ffcc44', d: 0.13 },
  { x: -322, y: -132, r: 2.2, c: '#ff6a00', d: 0.15 },
  { x: -144, y:  -82, r: 2.8, c: '#ffcc44', d: 0.11 },
  { x:    0, y:  -18, r: 4.0, c: '#ffffff', d: 0.08 },
  { x:  144, y:  -82, r: 2.8, c: '#ffcc44', d: 0.11 },
  { x:  322, y: -132, r: 2.2, c: '#ff6a00', d: 0.15 },
  { x:  490, y: -148, r: 1.5, c: '#ffcc44', d: 0.13 },
  { x:  652, y: -122, r: 1.8, c: '#ff8c00', d: 0.10 },
  { x:  -55, y:   38, r: 1.4, c: '#ff4500', d: 0.36 },
  { x:   55, y:   38, r: 1.4, c: '#ff4500', d: 0.36 },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function EagleTransition() {
  const { transitioning } = useSectionTransition();
  const [visible, setVisible] = useState(false);
  const [runKey, setRunKey]   = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!transitioning) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setRunKey((k) => k + 1);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 3200);
  }, [transitioning]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {visible && (
          <motion.svg
            key={runKey}
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            className="absolute w-full h-full"
            style={{ mixBlendMode: 'screen' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.92, 0] }}
            transition={{ duration: 2.8, times: [0, 0.08, 0.58, 1], ease: 'easeInOut' }}
          >
            <defs>
              {/* Soft atmosphere — very large blur, fills frame with warmth */}
              <filter id="f-atm" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="72" />
              </filter>
              {/* Wing edge + ember glow */}
              <filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Body / head bloom */}
              <filter id="f-core" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="20" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Wing radial fire glow */}
              <filter id="f-wing" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="14" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Directional comet trail — horizontal blur */}
              <filter id="f-trail" x="-30%" y="-200%" width="160%" height="500%">
                <feGaussianBlur stdDeviation="30 6" />
              </filter>
              {/* Tear — wide soft bloom */}
              <filter id="f-tear-soft" x="-10%" y="-400%" width="120%" height="900%">
                <feGaussianBlur stdDeviation="24" />
              </filter>
              {/* Tear — tight bright edge */}
              <filter id="f-tear-edge" x="-10%" y="-180%" width="120%" height="460%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Radial fire from body outward — hottest at center, cool at tips */}
              <radialGradient id="fire-radial" cx="0" cy="0" r="700" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#ff9900" stopOpacity="0.78" />
                <stop offset="25%"  stopColor="#ff5500" stopOpacity="0.52" />
                <stop offset="58%"  stopColor="#cc2200" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#660800" stopOpacity="0.00" />
              </radialGradient>

              {/* Comet trail — orange at eagle origin, transparent at end */}
              <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#ff8800" stopOpacity="0.82" />
                <stop offset="45%"  stopColor="#ff4400" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#990000" stopOpacity="0.00" />
              </linearGradient>

              {/* Tear line — white-hot at upper-right, fades toward lower-left */}
              <linearGradient id="tear-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#ffdd66" stopOpacity="1.00" />
                <stop offset="35%"  stopColor="#ff6600" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#aa1800" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* ── Diagonal fire tear — smooth glowing seam across screen ── */}
            {/* Outer atmospheric bloom */}
            <motion.path d={TEAR}
              stroke="#ff4400" strokeWidth="96" fill="none"
              filter="url(#f-tear-soft)"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0, 0.42, 0.28, 0], pathLength: [0, 1, 1, 1] }}
              transition={{ duration: 1.25, delay: 0.46, times: [0, 0.22, 0.62, 1] }}
            />
            {/* Bright inner edge */}
            <motion.path d={TEAR}
              stroke="url(#tear-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round"
              filter="url(#f-tear-edge)"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0, 1, 0.80, 0], pathLength: [0, 1, 1, 1] }}
              transition={{ duration: 1.15, delay: 0.48, times: [0, 0.20, 0.60, 1] }}
            />

            {/* ── Eagle — enters upper-right, swoops to center, exits upper-right ── */}
            {/*
                rotate ~175° puts the head (at +x in local) facing screen-left, diving toward page.
                The eagle's local +x tail direction maps to screen-right = the comet trail direction.
            */}
            <motion.g
              initial={{ x: 1750, y: -180, scale: 0.20, rotate: 172 }}
              animate={{
                x:      [1750, 1060, 2300],
                y:      [-180,  250, -320],
                scale:  [0.20,  1.15, 0.40],
                rotate: [172,   177,  163],
              }}
              transition={{
                duration: 2.8,
                times: [0, 0.33, 1],
                ease: [[0.14, 1, 0.28, 1], [0.40, 0, 0.62, 0]],
              }}
            >
              {/* Atmospheric halo — large radial warmth moving with eagle */}
              <motion.ellipse
                cx="0" cy="-20" rx="540" ry="220"
                fill="#ff4400" fillOpacity="0.18"
                filter="url(#f-atm)"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 0.80, 0], scale: [0.3, 1, 1.12] }}
                transition={{ duration: 2.4, times: [0, 0.26, 0.65, 1] }}
              />

              {/* Comet trail — directional blur extending behind eagle (+x = behind) */}
              <motion.path
                d="M 60 4 L 620 4"
                stroke="url(#trail-grad)" strokeWidth="82" fill="none"
                filter="url(#f-trail)"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.70, 0.20, 0], scaleX: [0, 1, 1] }}
                transition={{ duration: 1.40, times: [0, 0.26, 0.70, 1] }}
                style={{ transformOrigin: '60px 4px' }}
              />

              {/* Outer wing silhouettes — dark fill + glowing fire outline */}
              <motion.g
                initial={{ scaleX: 0.05 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.56, delay: 0.08, ease: [0.16, 1, 0.30, 1] }}
                style={{ transformOrigin: '0px 0px' }}
              >
                {/* Dark silhouette mass */}
                <path d={WING_L} fill="#0d0100" fillOpacity="0.96" />
                <path d={WING_R} fill="#0d0100" fillOpacity="0.96" />
                {/* Radial fire over silhouette */}
                <path d={WING_L} fill="url(#fire-radial)" fillOpacity="0.62" filter="url(#f-wing)" />
                <path d={WING_R} fill="url(#fire-radial)" fillOpacity="0.62" filter="url(#f-wing)" />
                {/* Glowing wing outline stroke */}
                <path d={WING_L} fill="none" stroke="#ff7700" strokeWidth="2.5" filter="url(#f-glow)" />
                <path d={WING_R} fill="none" stroke="#ff7700" strokeWidth="2.5" filter="url(#f-glow)" />
              </motion.g>

              {/* Inner wing layer — tighter fire glow near body */}
              <motion.g
                initial={{ scaleX: 0.08 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.48, delay: 0.14, ease: [0.16, 1, 0.30, 1] }}
                style={{ transformOrigin: '0px 0px' }}
              >
                <path d={WING_L2} fill="url(#fire-radial)" fillOpacity="0.44" filter="url(#f-glow)" />
                <path d={WING_R2} fill="url(#fire-radial)" fillOpacity="0.44" filter="url(#f-glow)" />
              </motion.g>

              {/* Feather rays — soft orange beams radiating from body to wing tips */}
              <motion.g
                filter="url(#f-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.68, 0.52, 0] }}
                transition={{ duration: 1.90, times: [0, 0.18, 0.60, 1], delay: 0.10 }}
              >
                {FEATHERS.map((f, i) => (
                  <path key={i} d={f.d} stroke={f.c} strokeWidth={f.w} fill="none" strokeOpacity="0.75" />
                ))}
              </motion.g>

              {/* Body — molten hexagon core */}
              <path d={BODY} fill="#ff6600" fillOpacity="0.94" filter="url(#f-core)" />
              {/* Head — slightly brighter amber */}
              <path d={HEAD} fill="#ffcc44" fillOpacity="0.92" filter="url(#f-core)" />
              {/* Beak — white-hot tip */}
              <path d={BEAK} fill="#ffffff" fillOpacity="0.88" filter="url(#f-glow)" />

              {/* Talons — flash at grab moment then retract */}
              <motion.g
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.88, 0], scaleY: [0, 1, 0.15] }}
                transition={{ duration: 0.70, delay: 0.40, ease: [0.16, 1, 0.30, 1] }}
                style={{ transformOrigin: '0px 20px' }}
              >
                <path d={TALONS} stroke="#ffcc44" strokeWidth="2.2" fill="none" filter="url(#f-glow)" />
              </motion.g>

              {/* Ember particles — minimal, glowing dots */}
              {EMBERS.map((e, i) => (
                <motion.circle
                  key={i} cx={e.x} cy={e.y} r={e.r} fill={e.c}
                  filter="url(#f-glow)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.90, 0.55, 0], scale: [0, 1.2, 0.8, 0] }}
                  transition={{ duration: 1.80, delay: e.d, times: [0, 0.18, 0.62, 1] }}
                />
              ))}
            </motion.g>
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}
