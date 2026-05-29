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

const SHAFTS = [
  { pos: [-2.0,  6, -7],  rot: [ 0.15,  0.10, 0], rTop: 0.04, rBot: 0.75, len: 16, color: '#06b6d4', base: 0.018, phase: 0.0 },
  { pos: [ 2.2,  7, -10], rot: [-0.10, -0.08, 0], rTop: 0.05, rBot: 0.88, len: 20, color: '#06b6d4', base: 0.014, phase: 1.2 },
  { pos: [ 0.0,  8, -8],  rot: [ 0.04,  0.05, 0], rTop: 0.03, rBot: 0.95, len: 22, color: '#a855f7', base: 0.011, phase: 2.4 },
  { pos: [-4.0,  6, -13], rot: [ 0.08,  0.18, 0], rTop: 0.04, rBot: 0.68, len: 15, color: '#06b6d4', base: 0.013, phase: 0.8 },
  { pos: [ 4.0,  5, -9],  rot: [-0.06, -0.14, 0], rTop: 0.05, rBot: 0.62, len: 14, color: '#a855f7', base: 0.010, phase: 1.9 },
];

export default function GodRays() {
  const groupRef = useRef();  // whole group follows cursor subtly
  const refs     = useRef([]);
  const speeds   = useMemo(() => SHAFTS.map(() => 0.18 + Math.random() * 0.14), []);

  const smoothRays = useRef(0.62);
  const smoothIdle = useRef(1.0);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const e = state.clock.elapsedTime;

    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    smoothRays.current = THREE.MathUtils.lerp(smoothRays.current, mood.raysM, d * 1.0);
    smoothIdle.current = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.3 : d * 3.5);

    const M = smoothRays.current * smoothIdle.current;

    // ── Cursor influence — light source drifts toward pointer ────────────────
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        state.pointer.x * 1.2,
        d * 0.55,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        state.pointer.y * 0.6,
        d * 0.55,
      );
    }

    // ── Shaft opacity — slower breathing when idle ────────────────────────────
    const breatheSpeed = isIdle ? 0.06 : 1.0;
    refs.current.forEach((mesh, i) => {
      if (!mesh?.material) return;
      const shaft = SHAFTS[i];
      mesh.material.opacity =
        (shaft.base + Math.sin(e * speeds[i] * breatheSpeed + shaft.phase) * (shaft.base * 0.4)) * M;
    });
  });

  return (
    <group ref={groupRef}>
      {SHAFTS.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={s.pos}
          rotation={s.rot}
        >
          <cylinderGeometry args={[s.rTop, s.rBot, s.len, 8, 1, true]} />
          <meshBasicMaterial
            color={s.color} transparent opacity={s.base}
            side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
