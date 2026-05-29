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

function ParticleLayer({
  positions, color, size, opacity,
  rotationSpeed, breatheSpeed, breatheAmp,
}) {
  const ref = useRef();
  // Per-layer smoothed multiplier — each layer lerps independently for depth effect
  const smoothM  = useRef(0.42);
  const smoothIdle = useRef(1.0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const d = Math.min(delta, 0.1);

    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    // Lerp speed: slow settle on idle, quick wake on activity
    smoothM.current    = THREE.MathUtils.lerp(smoothM.current, mood.particleM, d * 1.0);
    smoothIdle.current = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.3 : d * 3.5);

    const M = smoothM.current * smoothIdle.current;

    // Scroll velocity surge: disturbing the medium
    // Note: scrollVelocity comes from the store indirectly via the parent — we'll read from global
    // For particles, velocity is captured from the R3F pointer delta
    const surge = 1.0 + Math.abs(state.pointer.x - (ref.current.userData.prevPx ?? 0)) * 6;
    ref.current.userData.prevPx = state.pointer.x;

    ref.current.rotation.y += delta * rotationSpeed * M * surge;
    ref.current.rotation.x  = Math.sin(state.clock.elapsedTime * breatheSpeed) * breatheAmp * M;

    // Idle: particles slowly settle — gentle downward micro-drift
    const driftTarget = isIdle ? Math.sin(state.clock.elapsedTime * 0.08) * 0.04 : 0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, driftTarget, d * 0.5);

    // Opacity breathing
    if (ref.current.material) {
      ref.current.material.opacity = THREE.MathUtils.lerp(
        ref.current.material.opacity,
        opacity * M,
        d * 1.5,
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function buildPositions(count, spread, ySpread) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * spread;
    arr[i * 3 + 1] = (Math.random() - 0.5) * (ySpread ?? spread);
    arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return arr;
}

export default function SpaceParticles({ scrollVelocity = 0 }) {
  const layerA = useMemo(() => buildPositions(700, 90, 70), []);
  const layerB = useMemo(() => buildPositions(600, 55, 45), []);
  const layerC = useMemo(() => buildPositions(350, 35, 30), []);

  return (
    <group>
      <ParticleLayer
        positions={layerA} color="#c8eaf5"
        size={0.032} opacity={0.22}
        rotationSpeed={0.008} breatheSpeed={0.03} breatheAmp={0.06}
      />
      <ParticleLayer
        positions={layerB} color="#06b6d4"
        size={0.028} opacity={0.32}
        rotationSpeed={0.013} breatheSpeed={0.05} breatheAmp={0.05}
      />
      <ParticleLayer
        positions={layerC} color="#a855f7"
        size={0.022} opacity={0.26}
        rotationSpeed={-0.007} breatheSpeed={0.04} breatheAmp={0.04}
      />
    </group>
  );
}
