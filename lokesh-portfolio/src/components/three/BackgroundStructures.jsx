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

// Polished city-floating geometry — spheres, monolith boxes, flat tori
const SHAPES = [
  { pos: [-7.0,  1.5, -14], type: 'sphere', scale: 1.2, emissive: '#06b6d4', ei: 0.28, rx: 0.018, ry: 0.055 },
  { pos: [ 6.5,  0.5, -19], type: 'box',    scale: 1.8, emissive: '#a855f7', ei: 0.22, rx: 0.035, ry: 0.075 },
  { pos: [-4.5, -0.8, -26], type: 'sphere', scale: 2.2, emissive: '#0ea5e9', ei: 0.16, rx: 0.025, ry: 0.042 },
  { pos: [ 8.5,  2.5, -12], type: 'torus',  scale: 1.1, emissive: '#a855f7', ei: 0.32, rx: 0.072, ry: 0.055 },
  { pos: [-9.0, -1.2, -22], type: 'box',    scale: 2.6, emissive: '#0ea5e9', ei: 0.13, rx: 0.018, ry: 0.038 },
  { pos: [ 3.0,  3.0, -10], type: 'sphere', scale: 0.9, emissive: '#f59e0b', ei: 0.40, rx: 0.048, ry: 0.088 },
  { pos: [-5.5,  4.0, -17], type: 'torus',  scale: 1.4, emissive: '#06b6d4', ei: 0.24, rx: 0.055, ry: 0.038 },
  { pos: [10.0,  0.0, -15], type: 'sphere', scale: 1.5, emissive: '#a855f7', ei: 0.19, rx: 0.030, ry: 0.062 },
];

export default function BackgroundStructures() {
  const refs = useRef([]);

  // Seeded float phases for consistent SSR/client rendering
  const phases = useMemo(() => {
    let seed = 99;
    return SHAPES.map(() => {
      seed = Math.imul(seed, 1664525) + 1013904223 | 0;
      return ((seed >>> 0) / 0xffffffff) * Math.PI * 2;
    });
  }, []);

  const smoothStruct = useRef(0.38);
  const smoothIdle   = useRef(1.0);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const e = state.clock.elapsedTime;

    const { activeSection, isIdle, idleStartTime } = useAtmosphereStore.getState();
    const mood     = SECTION_MOODS[activeSection];
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    smoothStruct.current = THREE.MathUtils.lerp(smoothStruct.current, mood.structM, d * 0.9);
    smoothIdle.current   = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.3 : d * 3.5);
    const M = smoothStruct.current * smoothIdle.current;
    const rotScale = isIdle ? 0.06 : 1.0;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = SHAPES[i];

      mesh.rotation.x += delta * s.rx * rotScale;
      mesh.rotation.y += delta * s.ry * rotScale;
      // Gentle levitation
      mesh.position.y = SHAPES[i].pos[1] + Math.sin(e * 0.18 + phases[i]) * 0.45;

      if (mesh.material) {
        mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
          mesh.material.emissiveIntensity,
          s.ei * (0.75 + Math.sin(e * 0.28 + phases[i]) * 0.25) * M,
          d * 1.5,
        );
      }
    });
  });

  return (
    <group>
      {SHAPES.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={s.pos}
          scale={s.scale}
        >
          {s.type === 'sphere' && <sphereGeometry args={[1, 40, 40]} />}
          {s.type === 'box'    && <boxGeometry    args={[1, 1.6, 1]} />}
          {s.type === 'torus'  && <torusGeometry  args={[1, 0.28, 20, 80]} />}
          <meshStandardMaterial
            color="#060810"
            emissive={s.emissive}
            emissiveIntensity={s.ei}
            metalness={0.94}
            roughness={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}
