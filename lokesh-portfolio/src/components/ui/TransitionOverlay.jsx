'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSectionTransition } from '@/context/TransitionContext';

export default function TransitionOverlay() {
  const { transitioning } = useSectionTransition();

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          {/* Deep smoke vignette — dark ash at edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 32%, rgba(18,4,0,0.22) 68%, rgba(8,1,0,0.44) 100%)',
            }}
          />
          {/* Orange fire glow ring — inner edge */}
          <div
            className="absolute inset-0"
            style={{ boxShadow: 'inset 0 0 200px rgba(255,80,0,0.12)' }}
          />
          {/* Top ember sweep */}
          <motion.div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              top: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,140,0,0.65) 50%, transparent 100%)',
              boxShadow: '0 0 20px 4px rgba(255,80,0,0.70)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.50, ease: [0.16, 1, 0.30, 1] }}
          />
          {/* Bottom ember line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px]"
            style={{
              bottom: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,70,0,0.42) 50%, transparent 100%)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 0.65, 0] }}
            transition={{ duration: 0.50, ease: [0.16, 1, 0.30, 1], delay: 0.07 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
