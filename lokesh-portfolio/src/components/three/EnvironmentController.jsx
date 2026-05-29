'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  useAtmosphereStore,
  computeIdleSeconds,
  idleMultiplier,
} from '@/stores/atmosphereStore';

// Camera, fog, and lighting profiles per section — city-at-night aesthetic
const SCENES = [
  { // Hero: low angle looking across the grid, city horizon visible
    cam:  new THREE.Vector3(0,  1.2,  8.5), look: new THREE.Vector3(0, -0.4, 0),
    fog: '#000308', fn: 14, ff: 65,
    amb: '#0a1828', ai: 0.35,
    p1: '#06b6d4', i1: 2.2, p2: '#f59e0b', i2: 0.9,
  },
  { // Skills: slightly elevated, buildings in background
    cam:  new THREE.Vector3(0,  2.5,  7.0), look: new THREE.Vector3(0, -0.2, 0),
    fog: '#010210', fn: 10, ff: 50,
    amb: '#060c20', ai: 0.45,
    p1: '#a855f7', i1: 2.8, p2: '#f59e0b', i2: 0.6,
  },
  { // Projects: side angle — city silhouettes visible to the right
    cam:  new THREE.Vector3(3.5,  1.8,  7.0), look: new THREE.Vector3(-0.5, -0.2, 0),
    fog: '#010210', fn: 9,  ff: 48,
    amb: '#050a1a', ai: 0.40,
    p1: '#06b6d4', i1: 2.2, p2: '#a855f7', i2: 2.0,
  },
  { // Timeline: opposite side, dark and moody
    cam:  new THREE.Vector3(-4.0,  2.0,  6.5), look: new THREE.Vector3(0.8, -0.3, -0.5),
    fog: '#01010a', fn: 10, ff: 55,
    amb: '#0a0520', ai: 0.30,
    p1: '#06b6d4', i1: 3.8, p2: '#0ea5e9', i2: 2.8,
  },
  { // Lifestyle: higher vantage, looking down at the city grid spread below
    cam:  new THREE.Vector3(0,  5.5,  9.5), look: new THREE.Vector3(0, -2.0, -2.5),
    fog: '#000510', fn: 7,  ff: 42,
    amb: '#081808', ai: 0.25,
    p1: '#10b981', i1: 2.8, p2: '#f59e0b', i2: 2.2,
  },
  { // Contact: dramatic low ground-level shot, grid recedes to infinity
    cam:  new THREE.Vector3(0, -0.5, 11.0), look: new THREE.Vector3(0, 0.8, 0),
    fog: '#010005', fn: 9,  ff: 52,
    amb: '#0f0515', ai: 0.20,
    p1: '#06b6d4', i1: 5.0, p2: '#a855f7', i2: 4.0,
  },
];

export default function EnvironmentController({ scrollProgress, scrollVelocity = 0 }) {
  const { camera, scene } = useThree();
  const lookAt  = useRef(new THREE.Vector3());
  const mouse   = useRef(new THREE.Vector2());
  const aLight  = useRef();
  const pLight1 = useRef();
  const pLight2 = useRef();

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const e = state.clock.elapsedTime;

    const { isIdle, idleStartTime } = useAtmosphereStore.getState();
    const idleSecs = computeIdleSeconds(isIdle, idleStartTime);
    const idleMult = idleMultiplier(idleSecs);

    // Interpolate between scenes based on scroll
    const t  = scrollProgress * 5;
    const i1 = Math.min(Math.floor(t), 4);
    const i2 = Math.min(i1 + 1, 5);
    const w  = t - i1;
    const s1 = SCENES[i1];
    const s2 = SCENES[i2];

    const targetCam  = new THREE.Vector3().lerpVectors(s1.cam,  s2.cam,  w);
    const targetLook = new THREE.Vector3().lerpVectors(s1.look, s2.look, w);

    // Subtle mouse parallax — fades with scroll depth
    mouse.current.lerp(
      new THREE.Vector2(state.pointer.x * 0.8, state.pointer.y * 0.5),
      d * 2.5,
    );
    const parallax = Math.max(0, 1 - scrollProgress * 7);
    targetCam.x += mouse.current.x * parallax;
    targetCam.y += mouse.current.y * parallax * 0.4;

    // Gentle hero drift — floating above the city
    if (scrollProgress < 0.18) {
      targetCam.x += Math.sin(e * 0.06) * 0.22;
      targetCam.y += Math.cos(e * 0.04) * 0.10;
    }

    // Idle Lissajous orbit
    if (isIdle) {
      const dormantAmp = Math.min(0.35, idleSecs * 0.010);
      targetCam.x += Math.sin(e * 0.04)      * dormantAmp;
      targetCam.y += Math.sin(e * 0.027 + 1) * dormantAmp * 0.5;
      targetCam.z += Math.sin(e * 0.018 + 2) * dormantAmp * 0.3;
    }

    // Scroll velocity drag
    const velDrag = THREE.MathUtils.clamp(scrollVelocity, -3, 3);
    targetCam.y -= velDrag * 0.14;
    targetCam.z += Math.abs(velDrag) * 0.05;

    const camLerpSpeed = isIdle ? 1.4 : 3.2;
    camera.position.lerp(targetCam, d * camLerpSpeed);
    lookAt.current.lerp(targetLook, d * camLerpSpeed);
    camera.lookAt(lookAt.current);
    camera.updateProjectionMatrix();

    // Fog
    if (scene.fog) {
      const fogNear = THREE.MathUtils.lerp(s1.fn, s2.fn, w);
      const fogFar  = THREE.MathUtils.lerp(s1.ff, s2.ff, w);
      const idleFogFactor = isIdle ? (1 - idleSecs * 0.007) : 1.0;
      scene.fog.color.lerp(new THREE.Color(s1.fog).lerp(new THREE.Color(s2.fog), w), d * 3);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, fogNear * idleFogFactor, d * 3);
      scene.fog.far  = THREE.MathUtils.lerp(scene.fog.far,  fogFar  * idleFogFactor, d * 3);
    }

    // Lights
    if (aLight.current) {
      aLight.current.color.lerp(new THREE.Color(s1.amb).lerp(new THREE.Color(s2.amb), w), d * 3);
      aLight.current.intensity = THREE.MathUtils.lerp(
        aLight.current.intensity, THREE.MathUtils.lerp(s1.ai, s2.ai, w) * idleMult, d * 3,
      );
    }
    if (pLight1.current) {
      pLight1.current.color.lerp(new THREE.Color(s1.p1).lerp(new THREE.Color(s2.p1), w), d * 3);
      pLight1.current.intensity = THREE.MathUtils.lerp(
        pLight1.current.intensity, THREE.MathUtils.lerp(s1.i1, s2.i1, w) * idleMult, d * 3,
      );
    }
    if (pLight2.current) {
      pLight2.current.color.lerp(new THREE.Color(s1.p2).lerp(new THREE.Color(s2.p2), w), d * 3);
      pLight2.current.intensity = THREE.MathUtils.lerp(
        pLight2.current.intensity, THREE.MathUtils.lerp(s1.i2, s2.i2, w) * idleMult, d * 3,
      );
    }
  });

  return (
    <>
      <ambientLight ref={aLight} intensity={0.35} />
      {/* Overhead cool moonlight */}
      <pointLight ref={pLight1} position={[4,  8, 5]}  distance={40} />
      {/* Warm street-level amber fill */}
      <pointLight ref={pLight2} position={[-5, -1, 8]} distance={30} />
    </>
  );
}
