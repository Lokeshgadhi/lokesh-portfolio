'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  useAtmosphereStore,
  SECTION_MOODS,
  computeIdleSeconds,
  idleMultiplier,
} from '@/stores/atmosphereStore';

const RINGS = [
  { phase: 0.00, color: '#06b6d4', speed: 0.18, maxScale: 7.5 },
  { phase: 0.20, color: '#a855f7', speed: 0.16, maxScale: 8.0 },
  { phase: 0.40, color: '#06b6d4', speed: 0.20, maxScale: 7.0 },
  { phase: 0.60, color: '#a855f7', speed: 0.17, maxScale: 8.5 },
  { phase: 0.80, color: '#06b6d4', speed: 0.19, maxScale: 7.2 },
];

export default function PulseRings() {
  const refs       = useRef([]);
  const smoothPulse = useRef(0.52); // smoothed pulseM
  const smoothIdle  = useRef(1.0);

  useFrame((state, delta) => {
    const d  = Math.min(delta, 0.1);
    const t  = state.clock.elapsedTime;

    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    smoothPulse.current = THREE.MathUtils.lerp(smoothPulse.current, mood.pulseM, d * 1.2);
    smoothIdle.current  = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.35 : d * 3.5);

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const ring = RINGS[i];

      let cycle, opacityPeak;

      if (isIdle) {
        // ── Dormant heartbeat — slow, regular, atmospheric ──────────────────
        // All rings synchronized to a 0.28Hz heartbeat with slight stagger
        const heartRate   = 0.28;
        const heartPhase  = i * 0.08; // tiny stagger so they don't all pulse at once
        const heartCycle  = ((t * heartRate + heartPhase) % 1);
        cycle      = heartCycle;
        opacityPeak = 0.06 * smoothIdle.current; // very subtle
      } else {
        // ── Normal mode — continuous outward expansion ───────────────────────
        cycle      = (t * ring.speed * smoothPulse.current + ring.phase) % 1;
        opacityPeak = 0.11 * smoothPulse.current;
      }

      mesh.scale.setScalar(0.4 + cycle * ring.maxScale);
      if (mesh.material) {
        mesh.material.opacity = (1 - cycle) * opacityPeak;
      }
    });
  });

  return (
    <group position={[0, 0, -3.5]} rotation={[Math.PI / 2, 0, 0]}>
      {RINGS.map((ring, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <ringGeometry args={[0.97, 1.0, 72]} />
          <meshBasicMaterial
            color={ring.color} transparent opacity={0.09}
            blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
