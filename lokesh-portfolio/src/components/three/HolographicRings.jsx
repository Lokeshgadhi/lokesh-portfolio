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

export default function HolographicRings() {
  const cursorGroup = useRef(); // receives subtle tilt from mouse
  const outerGroup  = useRef(); // continuous y-rotation + z-sway
  const inner1      = useRef();
  const inner2      = useRef();
  const glowDisc    = useRef();

  // Smoothed multipliers — lerped every frame to avoid pops on section change
  const smoothHolo  = useRef(0.75);
  const smoothIdle  = useRef(1.0);

  const ticks = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => {
      const angle = (i / 32) * Math.PI * 2;
      return { x: Math.cos(angle) * 3.5, y: Math.sin(angle) * 3.5, rot: angle, h: i % 4 === 0 ? 0.20 : 0.10 };
    }),
  []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const e = state.clock.elapsedTime;

    // ── Mood ─────────────────────────────────────────────────────────────────
    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    const targetHolo = mood.holoM;
    const targetIdle = idleMult;

    smoothHolo.current = THREE.MathUtils.lerp(smoothHolo.current, targetHolo, d * 1.2);
    smoothIdle.current = THREE.MathUtils.lerp(smoothIdle.current, targetIdle, isIdle ? d * 0.4 : d * 3.5);

    const M = smoothHolo.current * smoothIdle.current;

    // ── Cursor influence — outer frame tilts toward pointer ──────────────────
    if (cursorGroup.current) {
      cursorGroup.current.rotation.x = THREE.MathUtils.lerp(
        cursorGroup.current.rotation.x,
        state.pointer.y * 0.12,
        d * 1.4,
      );
      cursorGroup.current.rotation.y = THREE.MathUtils.lerp(
        cursorGroup.current.rotation.y,
        state.pointer.x * 0.08,
        d * 1.4,
      );
    }

    // ── Outer ring: slow when idle ───────────────────────────────────────────
    const rotSpeed = isIdle ? 0.025 : 0.11;
    if (outerGroup.current) {
      outerGroup.current.rotation.y += d * rotSpeed;
      outerGroup.current.rotation.z  = Math.sin(e * 0.06) * 0.04;

      // Emissive intensity on all children
      outerGroup.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity,
            (child.geometry?.type === 'TorusGeometry' ? 0.85 : 0.65) * M,
            d * 2,
          );
        }
      });
    }

    // ── Inner rings ──────────────────────────────────────────────────────────
    const innerSpeed = isIdle ? 0.3 : 1.0;
    if (inner1.current) {
      inner1.current.rotation.x -= d * 0.20 * innerSpeed;
      inner1.current.rotation.z += d * 0.09 * innerSpeed;
      if (inner1.current.material) {
        inner1.current.material.opacity = THREE.MathUtils.lerp(
          inner1.current.material.opacity, 0.80 * M, d * 2,
        );
        inner1.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          inner1.current.material.emissiveIntensity, 2.4 * M, d * 2,
        );
      }
    }
    if (inner2.current) {
      inner2.current.rotation.y += d * 0.15 * innerSpeed;
      inner2.current.rotation.x  = Math.sin(e * 0.08 * innerSpeed) * 0.50;
      if (inner2.current.material) {
        inner2.current.material.opacity = THREE.MathUtils.lerp(
          inner2.current.material.opacity, 0.55 * M, d * 2,
        );
        inner2.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          inner2.current.material.emissiveIntensity, 3.2 * M, d * 2,
        );
      }
    }

    // ── Glow disc ────────────────────────────────────────────────────────────
    if (glowDisc.current?.material) {
      glowDisc.current.rotation.y -= d * 0.05;
      glowDisc.current.material.opacity =
        (0.052 + Math.sin(e * 0.45) * 0.018) * M;
    }
  });

  return (
    <group ref={cursorGroup} position={[0, 0, -3]}>

      <group ref={outerGroup}>
        <mesh>
          <torusGeometry args={[3.5, 0.022, 16, 160]} />
          <meshStandardMaterial
            color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.8}
            transparent opacity={0.85}
            blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </mesh>
        {ticks.map((tk, i) => (
          <mesh key={i} position={[tk.x, tk.y, 0]} rotation={[0, 0, tk.rot]}>
            <boxGeometry args={[0.005, tk.h, 0.005]} />
            <meshBasicMaterial
              color="#06b6d4" transparent opacity={0.65}
              blending={THREE.AdditiveBlending} depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <mesh ref={inner1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.2, 0.016, 12, 120]} />
        <meshStandardMaterial
          color="#a855f7" emissive="#a855f7" emissiveIntensity={2.4}
          transparent opacity={0.80}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      <mesh ref={inner2} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.4, 0.010, 8, 80]} />
        <meshStandardMaterial
          color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3.2}
          transparent opacity={0.55}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      <mesh ref={glowDisc} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshBasicMaterial
          color="#06b6d4" transparent opacity={0.032}
          blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>
    </group>
  );
}
