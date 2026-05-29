'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  useAtmosphereStore,
  SECTION_MOODS,
  computeIdleSeconds,
  idleMultiplier,
} from '@/stores/atmosphereStore';

const LINE_COUNT = 28;

function buildLines() {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const spread   = 9;
    const depthNear = 2 + Math.random() * 5;
    const depthFar  = depthNear + 2 + Math.random() * 6;
    return {
      pts:   new Float32Array([
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.55,
        -depthNear,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.55,
        -depthFar,
      ]),
      color: i % 3 === 0 ? '#a855f7' : '#06b6d4',
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2,
    };
  });
}

export default function NeuralStreams() {
  const refs  = useRef([]);
  const lines = useMemo(() => buildLines(), []);

  const smoothStream = useRef(0.35);
  const smoothIdle   = useRef(1.0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const t = (performance?.now() ?? Date.now()) / 1000;

    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    smoothStream.current = THREE.MathUtils.lerp(smoothStream.current, mood.streamM, d * 1.0);
    smoothIdle.current   = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.35 : d * 3.5);

    const M = smoothStream.current * smoothIdle.current;

    // Pulse speed: slower when idle, faster on skills/projects
    const pulseSpeedScale = isIdle ? 0.18 : 1.0;

    refs.current.forEach((obj, i) => {
      if (!obj?.material) return;
      const l = lines[i];
      // Peak opacity scales with mood; idle pulse frequency drops sharply
      const peakOp = 0.14 * M;
      obj.material.opacity = (Math.sin(t * l.speed * pulseSpeedScale + l.phase) * 0.5 + 0.5) * peakOp;
    });
  });

  return (
    <group>
      {lines.map((l, i) => (
        <line key={i} ref={(el) => { refs.current[i] = el; }}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position" count={2} array={l.pts} itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={l.color} transparent opacity={0.12}
            blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}
