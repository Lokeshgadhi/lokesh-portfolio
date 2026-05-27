'use client';

import { motion } from 'framer-motion';

export default function TerminalConsole({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed top-0 left-0 right-0 h-64 bg-black/90 border-b border-cyan-500/50 z-[100] font-mono text-cyan-400 p-6 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-bold">TERMINAL ACCESS LOG // SYSTEM CONSOLE</div>
        <button onClick={onClose} className="text-cyan-400 hover:text-white px-2 py-1 border border-cyan-500/50 hover:bg-cyan-500/20 rounded">
          CLOSE [ESC]
        </button>
      </div>
      <div className="flex-1 overflow-y-auto text-xs opacity-70">
        <p>{'>'} System initialized...</p>
        <p>{'>'} Neural link stable.</p>
        <p>{'>'} Waiting for user input_</p>
      </div>
      <input 
        type="text" 
        className="mt-4 bg-transparent border-none outline-none text-cyan-400 w-full"
        placeholder="Enter command..."
        autoFocus
      />
    </motion.div>
  );
}
