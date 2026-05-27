'use client';

import { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import {
  EffectComposer, Bloom, ChromaticAberration, Noise, Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ─── Scene Configurations ──────────────────────────────────────────────────────
const SCENE_CONFIGS = [
  {
    cameraPos:        new THREE.Vector3(0, 0.5, 8.5),
    lookAt:           new THREE.Vector3(0, 0, 0),
    fogColor:         '#020510',
    fogNear:          12,
    fogFar:           60,
    ambientColor:     '#06b6d4',
    ambientIntensity: 0.08,
    ptColor1:         '#06b6d4',
    ptIntensity1:     2.5,
    ptColor2:         '#a855f7',
    ptIntensity2:     2.0,
  },
  {
    cameraPos:        new THREE.Vector3(0, 0, 7),
    lookAt:           new THREE.Vector3(0, 0, 0),
    fogColor:         '#0c0128',
    fogNear:          5,
    fogFar:           30,
    ambientColor:     '#06b6d4',
    ambientIntensity: 0.2,
    ptColor1:         '#a855f7',
    ptIntensity1:     3.0,
    ptColor2:         '#fbbf24',
    ptIntensity2:     1.0,
  },
  {
    cameraPos:        new THREE.Vector3(3, 2, 7),
    lookAt:           new THREE.Vector3(0, 0, 0),
    fogColor:         '#020617',
    fogNear:          4,
    fogFar:           25,
    ambientColor:     '#3b82f6',
    ambientIntensity: 0.25,
    ptColor1:         '#06b6d4',
    ptIntensity1:     2.5,
    ptColor2:         '#ef4444',
    ptIntensity2:     2.0,
  },
  {
    cameraPos:        new THREE.Vector3(-4, 1.5, 6),
    lookAt:           new THREE.Vector3(1, 0, -1),
    fogColor:         '#02000a',
    fogNear:          5,
    fogFar:           35,
    ambientColor:     '#a855f7',
    ambientIntensity: 0.1,
    ptColor1:         '#06b6d4',
    ptIntensity1:     4.0,
    ptColor2:         '#3b82f6',
    ptIntensity2:     3.0,
  },
  {
    cameraPos:        new THREE.Vector3(0, 4, 8),
    lookAt:           new THREE.Vector3(0, -1, 0),
    fogColor:         '#0a0518',
    fogNear:          3,
    fogFar:           20,
    ambientColor:     '#10b981',
    ambientIntensity: 0.3,
    ptColor1:         '#ec4899',
    ptIntensity1:     3.0,
    ptColor2:         '#fbbf24',
    ptIntensity2:     2.5,
  },
  {
    cameraPos:        new THREE.Vector3(0, -2.5, 11),
    lookAt:           new THREE.Vector3(0, 2, 0),
    fogColor:         '#020005',
    fogNear:          6,
    fogFar:           40,
    ambientColor:     '#ffffff',
    ambientIntensity: 0.1,
    ptColor1:         '#06b6d4',
    ptIntensity1:     5.0,
    ptColor2:         '#a855f7',
    ptIntensity2:     4.0,
  },
];

// ─── Camera + Environment Controller ─────────────────────────────────────────
function EnvironmentController({ scrollProgress }) {
  const { camera, scene } = useThree();
  const currentLookAt = useRef(new THREE.Vector3());
  const mouseOffset   = useRef(new THREE.Vector2());
  const light1        = useRef();
  const light2        = useRef();
  const ambientLight  = useRef();

  useFrame((state, delta) => {
    const d  = Math.min(delta, 0.1);
    const p  = scrollProgress * 5;
    const i1 = Math.floor(p);
    const i2 = Math.min(i1 + 1, 5);
    const w  = p - i1;
    const c1 = SCENE_CONFIGS[i1] || SCENE_CONFIGS[0];
    const c2 = SCENE_CONFIGS[i2] || SCENE_CONFIGS[5];

    const targetPos    = new THREE.Vector3().lerpVectors(c1.cameraPos, c2.cameraPos, w);
    const targetLookAt = new THREE.Vector3().lerpVectors(c1.lookAt,    c2.lookAt,    w);

    // Mouse parallax — strongest at hero
    mouseOffset.current.lerp(
      new THREE.Vector2(state.pointer.x * 1.1, state.pointer.y * 0.65),
      d * 2.2
    );
    const parallax = Math.max(0, 1 - scrollProgress * 7);
    targetPos.x += mouseOffset.current.x * parallax;
    targetPos.y += mouseOffset.current.y * parallax * 0.55;

    // Slow cinematic drift (hero only)
    if (scrollProgress < 0.18) {
      targetPos.x += Math.sin(state.clock.elapsedTime * 0.065) * 0.3;
      targetPos.y += Math.cos(state.clock.elapsedTime * 0.045) * 0.15;
    }

    camera.position.lerp(targetPos, d * 3.5);
    currentLookAt.current.lerp(targetLookAt, d * 3.5);
    camera.lookAt(currentLookAt.current);
    camera.updateProjectionMatrix();

    if (scene.fog) {
      scene.fog.color.lerp(
        new THREE.Color(c1.fogColor).lerp(new THREE.Color(c2.fogColor), w), d * 3
      );
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, THREE.MathUtils.lerp(c1.fogNear, c2.fogNear, w), d * 3);
      scene.fog.far  = THREE.MathUtils.lerp(scene.fog.far,  THREE.MathUtils.lerp(c1.fogFar,  c2.fogFar,  w), d * 3);
    }
    if (ambientLight.current) {
      ambientLight.current.color.lerp(new THREE.Color(c1.ambientColor).lerp(new THREE.Color(c2.ambientColor), w), d * 3);
      ambientLight.current.intensity = THREE.MathUtils.lerp(ambientLight.current.intensity, THREE.MathUtils.lerp(c1.ambientIntensity, c2.ambientIntensity, w), d * 3);
    }
    if (light1.current) {
      light1.current.color.lerp(new THREE.Color(c1.ptColor1).lerp(new THREE.Color(c2.ptColor1), w), d * 3);
      light1.current.intensity = THREE.MathUtils.lerp(light1.current.intensity, THREE.MathUtils.lerp(c1.ptIntensity1, c2.ptIntensity1, w), d * 3);
    }
    if (light2.current) {
      light2.current.color.lerp(new THREE.Color(c1.ptColor2).lerp(new THREE.Color(c2.ptColor2), w), d * 3);
      light2.current.intensity = THREE.MathUtils.lerp(light2.current.intensity, THREE.MathUtils.lerp(c1.ptIntensity2, c2.ptIntensity2, w), d * 3);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLight} />
      <pointLight ref={light1} position={[5, 6, 4]}  distance={30} />
      <pointLight ref={light2} position={[-5, -2, 7]} distance={25} />
    </>
  );
}

// ─── Holographic Rings ────────────────────────────────────────────────────────
function HolographicRings() {
  const outerRef  = useRef();
  const inner1Ref = useRef();
  const inner2Ref = useRef();
  const glowRef   = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current)  { outerRef.current.rotation.y  += delta * 0.18;  outerRef.current.rotation.z  = Math.sin(t * 0.07) * 0.06; }
    if (inner1Ref.current) { inner1Ref.current.rotation.x -= delta * 0.28;  inner1Ref.current.rotation.z += delta * 0.12; }
    if (inner2Ref.current) { inner2Ref.current.rotation.y += delta * 0.22;  inner2Ref.current.rotation.x  = Math.sin(t * 0.09) * 0.5; }
    if (glowRef.current)   { glowRef.current.rotation.y   -= delta * 0.08;  glowRef.current.material.opacity = 0.04 + Math.sin(t * 0.6) * 0.015; }
  });

  return (
    <group position={[0, 0, -3]}>
      {/* Outer main ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[3.5, 0.025, 16, 160]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={4} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Secondary tick marks on outer ring */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const rx    = Math.cos(angle) * 3.5;
        const ry    = Math.sin(angle) * 3.5;
        return (
          <mesh key={i} position={[rx, ry, -3]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.006, i % 4 === 0 ? 0.18 : 0.09, 0.006]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}

      {/* Inner ring — purple, tilted */}
      <mesh ref={inner1Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.018, 12, 120]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Third ring — thin, fast */}
      <mesh ref={inner2Ref} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.4, 0.012, 8, 80]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={5} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Glow disc behind ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.04} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── Pulse Rings (sonar / energy burst) ──────────────────────────────────────
function PulseRings() {
  const POOL = 5;
  const refs   = useRef(Array.from({ length: POOL }, () => ({ ref: null, phase: 0 })));
  const meshes = useMemo(() => refs.current.map((_, i) => ({
    ref: { current: null },
    phase: i / POOL,
  })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshes.forEach(({ ref, phase }) => {
      if (!ref.current) return;
      const cycle   = (t * 0.22 + phase) % 1;
      const scale   = 0.5 + cycle * 7.5;
      const opacity = (1 - cycle) * 0.12;
      ref.current.scale.setScalar(scale);
      if (ref.current.material) ref.current.material.opacity = opacity;
    });
  });

  return (
    <group position={[0, 0, -3]}>
      {meshes.map(({ ref }, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.98, 1, 64]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#06b6d4' : '#a855f7'} transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── GPU Particle Cloud ───────────────────────────────────────────────────────
function ParticleCloud() {
  const cyanRef   = useRef();
  const purpleRef = useRef();
  const count     = 2200;

  const { cyanPos, purplePos, cyanVel } = useMemo(() => {
    const cp = new Float32Array(count * 3);
    const pp = new Float32Array(count * 3);
    const cv = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spherical distribution for cyan
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos((Math.random() - 0.5) * 2);
      const r     = 2 + Math.random() * 7;
      cp[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      cp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      cp[i * 3 + 2] = -3 + r * Math.cos(phi);
      cv[i]         = 0.003 + Math.random() * 0.007; // upward drift speed

      // Larger cloud for purple
      const t2 = Math.random() * Math.PI * 2;
      const p2 = Math.acos((Math.random() - 0.5) * 2);
      const r2 = 4 + Math.random() * 12;
      pp[i * 3]     = r2 * Math.sin(p2) * Math.cos(t2);
      pp[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pp[i * 3 + 2] = -3 + r2 * Math.cos(p2);
    }
    return { cyanPos: cp, purplePos: pp, cyanVel: cv };
  }, []);

  useFrame((state, delta) => {
    if (cyanRef.current) {
      const attr = cyanRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        attr.array[i * 3 + 1] += cyanVel[i];
        if (attr.array[i * 3 + 1] > 10) attr.array[i * 3 + 1] = -10;
      }
      attr.needsUpdate = true;
      cyanRef.current.rotation.y += delta * 0.025;
    }
    if (purpleRef.current) {
      purpleRef.current.rotation.y -= delta * 0.012;
      purpleRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.1;
    }
  });

  return (
    <>
      <points ref={cyanRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={cyanPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#06b6d4" transparent opacity={0.55} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <points ref={purpleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={purplePos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  );
}

// ─── Neural Energy Streams ────────────────────────────────────────────────────
function NeuralStreams() {
  const streamCount = 20;
  const refs = useRef([]);

  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < streamCount; i++) {
      const spread = 8;
      const ax = (Math.random() - 0.5) * spread;
      const ay = (Math.random() - 0.5) * spread * 0.6;
      const az = -2 - Math.random() * 12;
      const bx = (Math.random() - 0.5) * spread;
      const by = (Math.random() - 0.5) * spread * 0.6;
      const bz = -2 - Math.random() * 12;
      arr.push({
        pts: new Float32Array([ax, ay, az, bx, by, bz]),
        color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7',
        phaseOffset: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.5,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (mesh?.material) {
        const line = lines[i];
        mesh.material.opacity = (Math.sin(t * line.speed + line.phaseOffset) * 0.5 + 0.5) * 0.22;
      }
    });
  });

  return (
    <>
      {lines.map((l, i) => (
        <line key={i} ref={(el) => { refs.current[i] = el; }}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2} array={l.pts} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color={l.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </line>
      ))}
    </>
  );
}

// ─── God Ray Shafts (volumetric light beams) ──────────────────────────────────
function GodRayShafts() {
  const groupRef = useRef();
  const shafts = useMemo(() => [
    { pos: [-1.5, 5, -6],  rot: [0.15, 0.1, 0],   len: 14, color: '#06b6d4', opacity: 0.028 },
    { pos: [1.8,  6, -8],  rot: [-0.1, -0.12, 0],  len: 16, color: '#a855f7', opacity: 0.022 },
    { pos: [0,    7, -5],  rot: [0,    0.05, 0],   len: 18, color: '#06b6d4', opacity: 0.018 },
    { pos: [-3,   6, -10], rot: [0.08, 0.2, 0],    len: 12, color: '#a855f7', opacity: 0.020 },
    { pos: [3.5,  5, -7],  rot: [-0.06, -0.15, 0], len: 13, color: '#06b6d4', opacity: 0.016 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = shafts[i].opacity + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.005;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shafts.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <cylinderGeometry args={[0.08, 0.4, s.len, 8, 1, true]} />
          <meshBasicMaterial color={s.color} transparent opacity={s.opacity} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Volumetric Fog Layers ────────────────────────────────────────────────────
function FogLayers() {
  const groupRef = useRef();

  const planes = useMemo(() => [
    { y: -2.5, z: -10, w: 70, d: 22, color: '#06b6d4', speed: 0.03 },
    { y: -1.8, z: -18, w: 80, d: 28, color: '#a855f7', speed: 0.025 },
    { y: -1.2, z: -28, w: 90, d: 35, color: '#06b6d4', speed: 0.02 },
    { y: -0.5, z: -12, w: 65, d: 20, color: '#a855f7', speed: 0.035 },
    { y:  0.2, z: -22, w: 75, d: 26, color: '#06b6d4', speed: 0.028 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((plane, i) => {
      const p = planes[i];
      plane.position.x = Math.sin(state.clock.elapsedTime * p.speed + i * 1.4) * 4;
      if (plane.material) {
        plane.material.opacity = 0.022 + Math.abs(Math.sin(state.clock.elapsedTime * 0.2 + i)) * 0.012;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {planes.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, p.y, p.z]}>
          <planeGeometry args={[p.w, p.d]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.022} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Abstract Dark Structures ─────────────────────────────────────────────────
function DarkStructures() {
  const refs   = useRef([]);
  const shapes = useMemo(() => [
    { pos: [-8,  2, -15], geo: 'icosa', scale: 1.4, color: '#06b6d4', speed: 0.08 },
    { pos: [ 9, -1, -18], geo: 'octa',  scale: 1.8, color: '#a855f7', speed: 0.06 },
    { pos: [-6, -3, -22], geo: 'icosa', scale: 2.2, color: '#06b6d4', speed: 0.05 },
    { pos: [7,   3, -12], geo: 'tetra', scale: 1.1, color: '#a855f7', speed: 0.1  },
    { pos: [0,  -5, -30], geo: 'icosa', scale: 3.0, color: '#06b6d4', speed: 0.03 },
  ], []);

  useFrame((state, delta) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x += delta * shapes[i].speed * 0.7;
        mesh.rotation.y += delta * shapes[i].speed;
        if (mesh.material) {
          mesh.material.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.05;
        }
      }
    });
  });

  return (
    <>
      {shapes.map((s, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} position={s.pos} scale={s.scale}>
          {s.geo === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
          {s.geo === 'octa'  && <octahedronGeometry  args={[1, 0]} />}
          {s.geo === 'tetra' && <tetrahedronGeometry  args={[1, 0]} />}
          <meshStandardMaterial color="#030308" emissive={s.color} emissiveIntensity={0.18} wireframe roughness={0.5} metalness={0.9} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

// ─── Background Space Particles ───────────────────────────────────────────────
function SpaceParticles({ activeScene }) {
  const points = useRef();
  const count  = 1400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      const speed = activeScene === 4 ? 0.15 : activeScene === 1 ? 0.08 : 0.015;
      points.current.rotation.y += delta * speed;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#a8d8ea" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ─── Scene 0: Cinematic Hero Environment ──────────────────────────────────────
function HeroEnvironment({ active }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      const target = active ? 1 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 2);
    }
  });

  return (
    <group ref={groupRef}>
      <HolographicRings />
      <PulseRings />
      <ParticleCloud />
      <NeuralStreams />
      <GodRayShafts />
      <FogLayers />
      <DarkStructures />
    </group>
  );
}

// ─── Scene 1: Consciousness ───────────────────────────────────────────────────
function ConsciousnessObject({ active }) {
  const groupRef  = useRef();
  const pointCount = 900;
  const [positions] = useMemo(() => {
    const coords = [];
    for (let i = 0; i < pointCount; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi   = Math.acos(2.0 * v - 1.0);
      const lo    = i < pointCount / 2 ? 0.35 : -0.35;
      const r     = 1.1 + Math.random() * 0.6;
      coords.push(r * Math.sin(phi) * Math.cos(theta) + lo, r * Math.sin(phi) * Math.sin(theta) * 0.75, r * Math.cos(phi) * 0.85);
    }
    return [new Float32Array(coords)];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = active ? 1.25 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 3);
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.children[0].material.size = 0.03 * (Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 1.0);
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pointCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ─── Scene 2: Memory ──────────────────────────────────────────────────────────
function MemoryObject({ active }) {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = active ? 1.2 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 3);
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = 0.35;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh><sphereGeometry args={[2, 24, 24]} /><meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} /></mesh>
      <mesh><sphereGeometry args={[1.98, 8, 8]} /><meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.1} blending={THREE.AdditiveBlending} /></mesh>
      <group rotation={[(-16.56 * Math.PI) / 180, (81.51 * Math.PI) / 180, 0]}>
        <mesh position={[0, 0, 2]}><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color="#ef4444" /></mesh>
        <mesh position={[0, 0, 2]}><sphereGeometry args={[0.15, 8, 8]} /><meshBasicMaterial color="#ef4444" transparent opacity={0.4} blending={THREE.AdditiveBlending} /></mesh>
      </group>
    </group>
  );
}

// ─── Scene 3: Systems ─────────────────────────────────────────────────────────
function SystemsObject({ active }) {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 3);
      groupRef.current.children.forEach((m, idx) => {
        m.position.y = Math.sin(state.clock.elapsedTime + idx * 1.5) * 0.12;
        m.rotation.y = Math.cos(state.clock.elapsedTime * 0.5 + idx) * 0.05;
      });
    }
  });
  return (
    <group ref={groupRef}>
      <mesh position={[2, 0, -2]} rotation={[0, -0.4, 0]}><planeGeometry args={[2.5, 1.5]} /><meshStandardMaterial color="#010410" emissive="#06b6d4" emissiveIntensity={0.3} side={THREE.DoubleSide} transparent opacity={0.7} roughness={0.1} metalness={0.9} /></mesh>
      <mesh position={[-2.2, 0.5, -1]} rotation={[0, 0.5, 0]}><planeGeometry args={[2, 1.8]} /><meshStandardMaterial color="#010410" emissive="#a855f7" emissiveIntensity={0.25} side={THREE.DoubleSide} transparent opacity={0.6} roughness={0.1} metalness={0.9} /></mesh>
      <gridHelper args={[20, 20, '#06b6d4', '#1e1b4b']} position={[0, -2, 0]} />
    </group>
  );
}

// ─── Scene 4: Humanity ────────────────────────────────────────────────────────
function HumanityObject({ active }) {
  const groupRef = useRef();
  const pCount   = 250;
  const particles = useMemo(() => {
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2 * 6;
      const r = 0.3 + (i / pCount) * 4.0;
      pos[i * 3] = Math.cos(angle) * r; pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3 - (i / pCount) * 0.5; pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 3);
      groupRef.current.rotation.y -= delta * 0.4;
    }
  });
  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" count={pCount} array={particles} itemSize={3} /></bufferGeometry><pointsMaterial size={0.12} color="#ec4899" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} /></points>
      <mesh><sphereGeometry args={[0.3, 16, 16]} /><meshBasicMaterial color="#fbbf24" /></mesh>
    </group>
  );
}

// ─── Scene 5: Transmission ───────────────────────────────────────────────────
function TransmissionObject({ active }) {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), delta * 3);
      groupRef.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.8, 1.0, 32]} /><meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.6} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}><ringGeometry args={[0.4, 0.6, 32]} /><meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.7} /></mesh>
      <mesh position={[0, 4, 0]}><cylinderGeometry args={[0.4, 0.9, 8, 32, 1, true]} /><meshBasicMaterial color="#06b6d4" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
      <mesh position={[0, 5, 0]}><cylinderGeometry args={[0.02, 0.02, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
    </group>
  );
}

// ─── Post-processing ──────────────────────────────────────────────────────────
function PostFX() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!ready) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.6}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.88}
        mipmapBlur
        radius={0.82}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0007, 0.0007)}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.022}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        eskil={false}
        offset={0.12}
        darkness={0.85}
      />
    </EffectComposer>
  );
}

// ─── CSS Fallback ─────────────────────────────────────────────────────────────
function CSSFallback() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020510] via-[#030303] to-[#020005]" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/8 blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}

class WebGLErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e) { console.warn('WebGL failed:', e.message); }
  render() { return this.state.hasError ? <CSSFallback /> : this.props.children; }
}

function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
}

// ─── GlobalCanvas ─────────────────────────────────────────────────────────────
export default function GlobalCanvas({ scrollProgress = 0, bloomEnabled = true }) {
  const [webGLOk, setWebGLOk] = useState(null);
  const activeScene = Math.min(Math.floor(scrollProgress * 6), 5);

  useEffect(() => { setWebGLOk(isWebGLAvailable()); }, []);
  if (webGLOk === null) return null;
  if (!webGLOk) return <CSSFallback />;

  return (
    <WebGLErrorBoundary>
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Canvas
          camera={{ position: [0, 0.5, 8.5], fov: 60 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#020510']} />
          <fog attach="fog" args={['#020510', 12, 60]} />

          <EnvironmentController scrollProgress={scrollProgress} />

          <Stars radius={70} depth={50} count={2000} factor={3} fade speed={0.6} />
          <SpaceParticles activeScene={activeScene} />

          <HeroEnvironment      active={scrollProgress < 0.18} />
          <ConsciousnessObject  active={scrollProgress >= 0.18 && scrollProgress < 0.42} />
          <MemoryObject         active={scrollProgress >= 0.42 && scrollProgress < 0.65} />
          <SystemsObject        active={scrollProgress >= 0.65 && scrollProgress < 0.82} />
          <HumanityObject       active={scrollProgress >= 0.82 && scrollProgress < 0.94} />
          <TransmissionObject   active={scrollProgress >= 0.94} />

          {bloomEnabled && <PostFX />}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
