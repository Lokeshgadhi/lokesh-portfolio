'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  useAtmosphereStore,
  computeIdleSeconds,
  idleMultiplier,
} from '@/stores/atmosphereStore';

// City smog layers — dark, low-lying atmospheric haze near the horizon
const LAYERS = [
  { y: -2.2, z: -10, w: 100, d: 38, color: '#020812', baseOp: 0.22, drift: 0.010, breathe: 0.06 },
  { y: -1.2, z: -20, w: 120, d: 52, color: '#030510', baseOp: 0.15, drift: 0.007, breathe: 0.08 },
  { y: -0.2, z: -32, w: 145, d: 68, color: '#020310', baseOp: 0.09, drift: 0.005, breathe: 0.09 },
  { y:  1.2, z: -48, w: 170, d: 88, color: '#010210', baseOp: 0.05, drift: 0.003, breathe: 0.10 },
];

export default function FogLayers() {
  const refs   = useRef([]);
  const phases = useMemo(() => LAYERS.map((_, i) => i * (Math.PI / LAYERS.length) * 2), []);

  const smoothIdle = useRef(1.0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const t = (performance?.now() ?? Date.now()) / 1000;

    const { isIdle, idleStartTime } = useAtmosphereStore.getState();
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    smoothIdle.current = THREE.MathUtils.lerp(smoothIdle.current, idleMult, isIdle ? d * 0.3 : d * 3.0);

    const driftScale = isIdle ? 0.12 : 1.0;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const layer = LAYERS[i];
      mesh.position.x = Math.sin(t * layer.drift * driftScale + phases[i]) * 4;

      if (mesh.material) {
        const breatheAmp  = layer.baseOp * (isIdle ? 0.04 : 0.20);
        const breatheFreq = isIdle ? layer.breathe * 0.20 : layer.breathe;
        mesh.material.opacity = THREE.MathUtils.lerp(
          mesh.material.opacity,
          layer.baseOp * smoothIdle.current + Math.abs(Math.sin(t * breatheFreq + phases[i])) * breatheAmp,
          d * 1.5,
        );
      }
    });
  });

  return (
    <group>
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, layer.y, layer.z]}
        >
          <planeGeometry args={[layer.w, layer.d]} />
          <meshBasicMaterial
            color={layer.color} transparent opacity={layer.baseOp}
            side={THREE.DoubleSide} blending={THREE.NormalBlending} depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
