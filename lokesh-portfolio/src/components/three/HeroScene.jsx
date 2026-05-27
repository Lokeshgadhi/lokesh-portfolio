'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Bloom Presets ─────────────────────────────────────────────────────────────
// Change ACTIVE_PRESET below to switch the look. The dev toggle (bottom-left
// in the browser) turns bloom on/off for comparison — it uses whatever preset
// is active here.
//
//   SUBTLE    — micro-glow polish, barely noticeable, just adds depth
//   CINEMATIC — default. Blade Runner energy: neon pulses, particles shimmer
//   EXTREME   — pushed hard, overloaded neon, good for testing limits
//
const BLOOM_PRESETS = {
  SUBTLE:    { intensity: 0.6,  luminanceThreshold: 0.30, luminanceSmoothing: 0.9, radius: 0.60 },
  CINEMATIC: { intensity: 1.5,  luminanceThreshold: 0.15, luminanceSmoothing: 0.9, radius: 0.85 },
  EXTREME:   { intensity: 3.5,  luminanceThreshold: 0.05, luminanceSmoothing: 0.9, radius: 1.00 },
};

const ACTIVE_PRESET = BLOOM_PRESETS.CINEMATIC; // ← change preset here
// ───────────────────────────────────────────────────────────────────────────────

function Particles({ count = 2000 }) {
  const points = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      const hue = 0.7 + Math.random() * 0.3; // purple to cyan range
      color.setHSL(hue, 0.8, 0.6);
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Skyscraper({ position, height, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1 + 0.9;
      ref.current.material.emissiveIntensity = flicker * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial
        color="#0a0118"
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

function City() {
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = -10 - Math.random() * 30;
      const height = 3 + Math.random() * 12;
      const colors = ['#a855f7', '#06b6d4', '#3b82f6', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      arr.push({ position: [x, -5 + height / 2, z], height, color });
    }
    return arr;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <Skyscraper key={i} {...b} />
      ))}
    </group>
  );
}

function Character() {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
      ref.current.scale.y = 1 + breathe;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={ref} position={[0, -1, 3]}>
        {/* Body — emissive bumped 0.2→0.4 so bloom catches the rim light */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
          <meshStandardMaterial color="#000000" emissive="#a855f7" emissiveIntensity={0.4} />
        </mesh>
        {/* Head — emissive bumped 0.3→0.5 for a stronger cyan halo */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#000000" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[2, 2, 1]}  color="#a855f7" intensity={2}   distance={5} />
        <pointLight position={[-2, 1, 1]} color="#06b6d4" intensity={1.5} distance={5} />
      </group>
    </Float>
  );
}

function FogRings() {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, -4, 0]}>
      {[1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -5 * i]}>
          <ringGeometry args={[3 * i, 3.1 * i, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#a855f7' : '#06b6d4'}
            transparent
            opacity={0.15 / i}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    const x = state.pointer.x * 0.5;
    const y = state.pointer.y * 0.3;
    state.camera.position.x += (x - state.camera.position.x) * 0.03;
    state.camera.position.y += (y + 1 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ bloomEnabled = true }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 10], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000308']} />
      <fog attach="fog" args={['#0a0118', 8, 50]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[0, 5, 5]}  intensity={1} color="#06b6d4" distance={20} />
      <pointLight position={[0, -2, 8]} intensity={2} color="#ec4899" distance={15} />

      <Stars radius={50} depth={50} count={3000} factor={4} fade speed={1} />
      <Particles count={1500} />
      <City />
      <Character />
      <FogRings />
      <CameraRig />

      {/* Post-processing — must be last inside Canvas */}
      {bloomEnabled && (
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={ACTIVE_PRESET.intensity}
            luminanceThreshold={ACTIVE_PRESET.luminanceThreshold}
            luminanceSmoothing={ACTIVE_PRESET.luminanceSmoothing}
            mipmapBlur
            radius={ACTIVE_PRESET.radius}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
