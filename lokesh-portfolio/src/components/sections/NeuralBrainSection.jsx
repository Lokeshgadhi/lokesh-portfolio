'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalData } from '@/data/personal';

export default function NeuralBrainSection() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Generate neural nodes in a brain-like pattern
  const nodes = personalData.skills.map((skill, i) => {
    const angle = (i / personalData.skills.length) * Math.PI * 2;
    const radius = 35 + Math.sin(i * 1.7) * 8;
    return {
      ...skill,
      id: i,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      delay: i * 0.1,
    };
  });

  // Generate connections
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.5) {
        connections.push({ from: nodes[i], to: nodes[j], id: `${i}-${j}` });
      }
    }
  }

  return (
    <section id="mind" ref={ref} className="relative w-full py-4 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-[150px] animate-glow-pulse pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-3"
        >
          <div className="inline-block glass rounded-full px-4 py-1.5 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              Section 01 / Neural Network
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-2">
            <span className="gradient-text">The Mind</span>
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/50 max-w-xl mx-auto">
            Every neuron is a skill. Every connection is a possibility. Hover the nodes to explore.
          </p>
        </motion.div>

        {/* Neural network visualization */}
        <div className="relative aspect-square max-w-lg mx-auto">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))' }}
          >
            {/* Connection lines */}
            {connections.map((conn, i) => (
              <motion.line
                key={conn.id}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={
                  hoveredNode === conn.from.id || hoveredNode === conn.to.id
                    ? '#06b6d4'
                    : 'rgba(168, 85, 247, 0.2)'
                }
                strokeWidth={hoveredNode === conn.from.id || hoveredNode === conn.to.id ? 0.3 : 0.1}
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, delay: i * 0.02 }}
                style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
              />
            ))}

            {/* Center brain core */}
            <g>
              <motion.circle
                cx="50"
                cy="50"
                r="3"
                fill="url(#coreGradient)"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.text
                x="50"
                y="57"
                fontSize="2.5"
                fill="#06b6d4"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ pointerEvents: 'none', fontWeight: 'bold', letterSpacing: '2px' }}
              >
                CORE
              </motion.text>
            </g>
            <motion.circle
              cx="50"
              cy="50"
              r="5"
              fill="none"
              stroke="rgba(6, 182, 212, 0.5)"
              strokeWidth="0.2"
              animate={{
                r: [5, 8, 5],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="5"
              fill="none"
              stroke="rgba(168, 85, 247, 0.5)"
              strokeWidth="0.2"
              animate={{
                r: [5, 10, 5],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />

            {/* Skill nodes */}
            {nodes.map((node, i) => (
              <g key={node.id}>
                {/* Glow ring */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={hoveredNode === node.id ? 4 : 2.5}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.3"
                  opacity={hoveredNode === node.id ? 0.8 : 0.3}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Main node */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="1.5"
                  fill={node.color}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: node.delay }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', filter: `drop-shadow(0 0 4px ${node.color})` }}
                />
                {/* Pulse animation */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="1.5"
                  fill={node.color}
                  animate={{
                    r: [1.5, 3, 1.5],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
                
                {/* SVG Text Label (Always Visible) */}
                <motion.text
                  x={node.x}
                  y={node.y + 4}
                  fontSize="2"
                  fill="white"
                  textAnchor="middle"
                  opacity={hoveredNode === node.id ? 1 : 0.6}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: hoveredNode === node.id ? 1 : 0.6 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: node.delay + 0.3 }}
                  style={{ pointerEvents: 'none', transition: 'opacity 0.3s ease' }}
                >
                  {node.name}
                </motion.text>
              </g>
            ))}

            {/* Gradients */}
            <defs>
              <radialGradient id="coreGradient">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </radialGradient>
            </defs>
          </svg>

          {/* HTML overlays for node labels (Detailed info on hover) */}
          {nodes.map((node) => (
            <div
              key={`label-${node.id}`}
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: hoveredNode === node.id ? 1 : 0,
                zIndex: 20,
              }}
            >
              <div
                className="glass-strong rounded-lg px-3 py-1.5 whitespace-nowrap bg-black/80 backdrop-blur-md"
                style={{
                  marginTop: '-40px',
                  border: `1px solid ${node.color}`,
                  boxShadow: `0 0 20px ${node.color}40`,
                }}
              >
                <div className="font-mono text-[9px] uppercase tracking-wider opacity-60">
                  {node.category}
                </div>
                <div className="font-display font-bold text-xs" style={{ color: node.color }}>
                  {node.name}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
