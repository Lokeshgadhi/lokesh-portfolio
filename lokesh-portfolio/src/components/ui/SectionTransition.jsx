'use client';

import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  // Initial state before entering — panel off-screen, dark, soft focus
  enter: (dir) => ({
    opacity: 0,
    x: dir * 44,
    filter: 'blur(9px) brightness(1.22)',
    scale: 0.976,
  }),

  // Settled state — panel fully materialised
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px) brightness(1)',
    scale: 1,
    transition: {
      // Position leads; blur and scale trail behind for depth-of-field feel
      x:       { duration: 0.72, ease: [0.16, 1, 0.30, 1] },
      opacity: { duration: 0.60, ease: [0.22, 1, 0.36, 1] },
      filter:  { duration: 0.68, ease: [0.16, 1, 0.30, 1] },
      scale:   { duration: 0.70, ease: [0.16, 1, 0.30, 1] },
    },
  },

  // Exit state — panel recalled, power cut early
  exit: (dir) => ({
    opacity: 0,
    x: dir * -44,
    filter: 'blur(9px) brightness(0.62)',
    scale: 0.976,
    transition: {
      // Opacity cuts first — holographic "power off" before motion completes
      x:       { duration: 0.44, ease: [0.42, 0, 0.68, 0] },
      opacity: { duration: 0.26, ease: [0.55, 0, 0.78, 0] },
      filter:  { duration: 0.44, ease: [0.42, 0, 0.68, 0] },
      scale:   { duration: 0.44, ease: [0.42, 0, 0.68, 0] },
    },
  }),
};

export default function SectionTransition({ sectionKey, direction, children }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={sectionKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
