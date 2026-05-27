'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (isHidden) setIsHidden(false);
    };

    const handleMouseLeave = () => setIsHidden(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHidden]);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 700, mass: 0.1 }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Glow follower */}
      <motion.div
        className="fixed pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: position.x - 200,
          y: position.y - 200,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.5 }}
      >
        <div className="w-[400px] h-[400px] rounded-full bg-gradient-radial from-purple-500/20 via-cyan-500/10 to-transparent blur-3xl" 
             style={{
               background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.08) 30%, transparent 70%)'
             }}
        />
      </motion.div>
    </>
  );
}
