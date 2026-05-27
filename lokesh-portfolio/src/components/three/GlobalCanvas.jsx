'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Scene Configurations for Lerping ──────────────────────────────────────────
const SCENE_CONFIGS = [
  // Scene 0: BOOT / HERO
  {
    cameraPos: new THREE.Vector3(0, 1, 9),
    lookAt: new THREE.Vector3(0, 0, 0),
    fogColor: '#0a0118',
    fogNear: 8,
    fogFar: 50,
    ambientColor: '#a855f7',
    ambientIntensity: 0.15,
    ptColor1: '#06b6d4', // Cyan
    ptIntensity1: 2.0,
    ptColor2: '#ec4899', // Pink
    ptIntensity2: 1.5,
  },
  // Scene 1: CONSCIOUSNESS / MIND (Skills Brain)
  {
    cameraPos: new THREE.Vector3(0, 0, 7),
    lookAt: new THREE.Vector3(0, 0, 0),
    fogColor: '#0c0128',
    fogNear: 5,
    fogFar: 30,
    ambientColor: '#06b6d4',
    ambientIntensity: 0.2,
    ptColor1: '#a855f7', // Purple
    ptIntensity1: 3.0,
    ptColor2: '#fbbf24', // Amber
    ptIntensity2: 1.0,
  },
  // Scene 2: MEMORY / TIMELINE (Globe / West Godavari coords)
  {
    cameraPos: new THREE.Vector3(3, 2, 7),
    lookAt: new THREE.Vector3(0, 0, 0),
    fogColor: '#020617',
    fogNear: 4,
    fogFar: 25,
    ambientColor: '#3b82f6', // Blue
    ambientIntensity: 0.25,
    ptColor1: '#06b6d4', // Cyan
    ptIntensity1: 2.5,
    ptColor2: '#ef4444', // Red (for beacon highlight)
    ptIntensity2: 2.0,
  },
  // Scene 3: SYSTEMS / PROJECTS (Dashboard screens)
  {
    cameraPos: new THREE.Vector3(-4, 1.5, 6),
    lookAt: new THREE.Vector3(1, 0, -1),
    fogColor: '#02000a',
    fogNear: 5,
    fogFar: 35,
    ambientColor: '#a855f7',
    ambientIntensity: 0.1,
    ptColor1: '#06b6d4', // Cyan
    ptIntensity1: 4.0,
    ptColor2: '#3b82f6', // Blue
    ptIntensity2: 3.0,
  },
  // Scene 4: HUMANITY / LIFESTYLE (Discipline Vortex)
  {
    cameraPos: new THREE.Vector3(0, 4, 8),
    lookAt: new THREE.Vector3(0, -1, 0),
    fogColor: '#0a0518',
    fogNear: 3,
    fogFar: 20,
    ambientColor: '#10b981', // Green / Emerald
    ambientIntensity: 0.3,
    ptColor1: '#ec4899', // Pink
    ptIntensity1: 3.0,
    ptColor2: '#fbbf24', // Amber
    ptIntensity2: 2.5,
  },
  // Scene 5: TRANSMISSION / VISION (Final Beacon)
  {
    cameraPos: new THREE.Vector3(0, -2.5, 11),
    lookAt: new THREE.Vector3(0, 2, 0),
    fogColor: '#020005',
    fogNear: 6,
    fogFar: 40,
    ambientColor: '#ffffff',
    ambientIntensity: 0.1,
    ptColor1: '#06b6d4',
    ptIntensity1: 5.0,
    ptColor2: '#a855f7',
    ptIntensity2: 4.0,
  },
];

// ─── Camera and Environment Controller ──────────────────────────────────────────
function EnvironmentController({ scrollProgress }) {
  const { camera, scene } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const light1 = useRef();
  const light2 = useRef();
  const ambientLight = useRef();

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);

    // Map scrollProgress (0 to 1) to segment index (0 to 5)
    const progress = scrollProgress * 5;
    const index1 = Math.floor(progress);
    const index2 = Math.min(index1 + 1, 5);
    const weight = progress - index1;

    const config1 = SCENE_CONFIGS[index1] || SCENE_CONFIGS[0];
    const config2 = SCENE_CONFIGS[index2] || SCENE_CONFIGS[5];

    // Lerp values between the two adjacent configurations
    const targetCameraPos = new THREE.Vector3().lerpVectors(config1.cameraPos, config2.cameraPos, weight);
    const targetLookAt = new THREE.Vector3().lerpVectors(config1.lookAt, config2.lookAt, weight);
    
    const targetFogColor = new THREE.Color(config1.fogColor).lerp(new THREE.Color(config2.fogColor), weight);
    const targetFogNear = THREE.MathUtils.lerp(config1.fogNear, config2.fogNear, weight);
    const targetFogFar = THREE.MathUtils.lerp(config1.fogFar, config2.fogFar, weight);

    const targetAmbientColor = new THREE.Color(config1.ambientColor).lerp(new THREE.Color(config2.ambientColor), weight);
    const targetAmbientIntensity = THREE.MathUtils.lerp(config1.ambientIntensity, config2.ambientIntensity, weight);

    const targetPtColor1 = new THREE.Color(config1.ptColor1).lerp(new THREE.Color(config2.ptColor1), weight);
    const targetPtIntensity1 = THREE.MathUtils.lerp(config1.ptIntensity1, config2.ptIntensity1, weight);

    const targetPtColor2 = new THREE.Color(config1.ptColor2).lerp(new THREE.Color(config2.ptColor2), weight);
    const targetPtIntensity2 = THREE.MathUtils.lerp(config1.ptIntensity2, config2.ptIntensity2, weight);

    // Smoothly transition camera positions using delta
    camera.position.lerp(targetCameraPos, d * 3.5);
    currentLookAt.current.lerp(targetLookAt, d * 3.5);
    camera.lookAt(currentLookAt.current);
    camera.updateProjectionMatrix();

    // Smoothly transition Fog
    if (scene.fog) {
      scene.fog.color.lerp(targetFogColor, d * 3);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, targetFogNear, d * 3);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, targetFogFar, d * 3);
    }

    // Smoothly transition Lights
    if (ambientLight.current) {
      ambientLight.current.color.lerp(targetAmbientColor, d * 3);
      ambientLight.current.intensity = THREE.MathUtils.lerp(ambientLight.current.intensity, targetAmbientIntensity, d * 3);
    }
    if (light1.current) {
      light1.current.color.lerp(targetPtColor1, d * 3);
      light1.current.intensity = THREE.MathUtils.lerp(light1.current.intensity, targetPtIntensity1, d * 3);
    }
    if (light2.current) {
      light2.current.color.lerp(targetPtColor2, d * 3);
      light2.current.intensity = THREE.MathUtils.lerp(light2.current.intensity, targetPtIntensity2, d * 3);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLight} />
      <pointLight ref={light1} position={[4, 5, 5]} distance={25} />
      <pointLight ref={light2} position={[-4, -3, 8]} distance={20} />
      <directionalLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />
    </>
  );
}

// ─── Sub-Component: Space Particles ──────────────────────────────────────────
function SpaceParticles({ activeScene }) {
  const points = useRef();
  const count = 1200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      // Rotation speed changes per scene
      const speed = activeScene === 4 ? 0.15 : activeScene === 1 ? 0.08 : 0.02;
      points.current.rotation.y += delta * speed;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scene Objects: Scene 0 (BOOT skyscrapers + character) ───────────────────
function BootObject({ active }) {
  const groupRef = useRef();

  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 35; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = -5 - Math.random() * 20;
      const height = 2 + Math.random() * 8;
      const color = ['#a855f7', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 3)];
      arr.push({ position: [x, -4 + height / 2, z], height, color });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Lerp visibility/scale
      const targetScale = active ? 1 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      
      // Skyscraper flicker
      groupRef.current.children.forEach((mesh) => {
        if (mesh.material && mesh.material.emissiveIntensity !== undefined) {
          const flicker = Math.sin(state.clock.elapsedTime * 3 + mesh.position.x) * 0.15 + 0.55;
          mesh.material.emissiveIntensity = flicker;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Skyscapers */}
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position}>
          <boxGeometry args={[0.8, b.height, 0.8]} />
          <meshStandardMaterial
            color="#05010e"
            emissive={b.color}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Cyber Character Cylinder */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <group position={[0, -0.5, 3]}>
          <mesh>
            <capsuleGeometry args={[0.25, 0.9, 4, 8]} />
            <meshStandardMaterial color="#000000" emissive="#a855f7" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#000000" emissive="#06b6d4" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// ─── Scene Objects: Scene 1 (CONSCIOUSNESS - Brain Neural Grid) ───────────────
function ConsciousnessObject({ active }) {
  const groupRef = useRef();
  const pointCount = 900;

  // Generate a detailed, volumetric brain-shaped particle cloud
  const [positions] = useMemo(() => {
    const coords = [];
    for (let i = 0; i < pointCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      // Separate into left and right hemispheres (lobes) for realistic brain shape
      const isRightLobe = i < pointCount / 2;
      const lobeOffset = isRightLobe ? 0.35 : -0.35;
      
      const r = 1.1 + Math.random() * 0.6;
      
      let x = r * Math.sin(phi) * Math.cos(theta) + lobeOffset;
      let y = r * Math.sin(phi) * Math.sin(theta) * 0.75; // slightly flattened
      let z = r * Math.cos(phi) * 0.85; // slightly compressed

      coords.push(x, y, z);
    }
    const posArray = new Float32Array(coords);
    return [posArray];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.25 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      groupRef.current.rotation.y += delta * 0.08;
      
      // Floating pulse
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 1.0;
      groupRef.current.children[0].material.size = 0.03 * pulse;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Volumetric Subconscious Particle Cloud (Nebula) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#a855f7"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── Scene Objects: Scene 2 (MEMORY - Holographic Wireframe Globe) ────────────
function MemoryObject({ active }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.2 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = 0.35; // Tilt axis like earth
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Globe Grid */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lat/Lon bands */}
      <mesh>
        <sphereGeometry args={[1.98, 8, 8]} />
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* West Godavari, Andhra Pradesh India location marker dot (lat 16.56, lng 81.51) */}
      {/* Placed on sphere surface based on coordinates */}
      <group rotation={[(-16.56 * Math.PI) / 180, (81.51 * Math.PI) / 180, 0]}>
        <mesh position={[0, 0, 2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, 0, 2]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Pulsing glow ring */}
        <Float speed={3} rotationIntensity={0} floatIntensity={0.2}>
          <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.25, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

// ─── Scene Objects: Scene 3 (SYSTEMS - Floating Code Screens) ─────────────────
function SystemsObject({ active }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      
      // Individual board floats
      groupRef.current.children.forEach((mesh, index) => {
        mesh.position.y = Math.sin(state.clock.elapsedTime * 1.0 + index * 1.5) * 0.12;
        mesh.rotation.y = Math.cos(state.clock.elapsedTime * 0.5 + index) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Screen 1: Right Pane */}
      <mesh position={[2, 0, -2]} rotation={[0, -0.4, 0]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial
          color="#010410"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Screen 2: Left Pane */}
      <mesh position={[-2.2, 0.5, -1]} rotation={[0, 0.5, 0]}>
        <planeGeometry args={[2.0, 1.8]} />
        <meshStandardMaterial
          color="#010410"
          emissive="#a855f7"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Grid Floor */}
      <gridHelper args={[20, 20, '#06b6d4', '#1e1b4b']} position={[0, -2, 0]} opacity={0.3} transparent />
    </group>
  );
}

// ─── Scene Objects: Scene 4 (HUMANITY - Discipline Vortex) ───────────────────
function HumanityObject({ active }) {
  const groupRef = useRef();
  const particleCount = 250;

  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const scale = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 * 6; // spiral loops
      const radius = 0.3 + (i / particleCount) * 4.0;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3 - (i / particleCount) * 0.5; // slow funnel down
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      scale[i] = Math.random() * 0.08 + 0.02;
    }
    return { pos, scale };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      groupRef.current.rotation.y -= delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#ec4899"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner Core Light sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// ─── Scene Objects: Scene 5 (TRANSMISSION - Holographic Beacon) ──────────────
function TransmissionObject({ active }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.0 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      {/* Base ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      {/* Volumetric Pillar Cylinder */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.4, 0.9, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core line of light */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ─── WebGL Support Detection ─────────────────────────────────────────────────
function isWebGLAvailable() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// ─── CSS Fallback Background ─────────────────────────────────────────────────
function CSSFallbackBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#030303] to-[#020005]" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Star field using CSS */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `radial-gradient(1px 1px at 20px 30px, #06b6d4, transparent),
                          radial-gradient(1px 1px at 40px 70px, #a855f7, transparent),
                          radial-gradient(1px 1px at 50px 160px, white, transparent),
                          radial-gradient(1px 1px at 90px 40px, #06b6d4, transparent),
                          radial-gradient(1px 1px at 130px 80px, white, transparent),
                          radial-gradient(1px 1px at 160px 120px, #a855f7, transparent)`,
        backgroundSize: '200px 200px',
      }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />
    </div>
  );
}

// ─── Error Boundary for WebGL ────────────────────────────────────────────────
import { Component } from 'react';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Canvas failed, using CSS fallback:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return <CSSFallbackBackground />;
    }
    return this.props.children;
  }
}

// ─── Global Canvas Root ─────────────────────────────────────────────────────
export default function GlobalCanvas({ scrollProgress = 0, bloomEnabled = true }) {
  // Map scroll progress to approximate scene boundaries for particle adjustments
  const activeSceneIndex = Math.min(Math.floor(scrollProgress * 6), 5);

  // Check WebGL support on client
  if (typeof window !== 'undefined' && !isWebGLAvailable()) {
    return <CSSFallbackBackground />;
  }

  return (
    <WebGLErrorBoundary>
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Canvas
          camera={{ position: [0, 1, 9], fov: 60 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#030303']} />
          <fog attach="fog" args={['#020202', 8, 50]} />

          {/* Global Lighting and camera lerping control */}
          <EnvironmentController scrollProgress={scrollProgress} />

          {/* Background stars */}
          <Stars radius={60} depth={40} count={2500} factor={3} fade speed={1.2} />

          {/* Floating space particles */}
          <SpaceParticles activeScene={activeSceneIndex} />

          {/* Scene Objects */}
          <BootObject active={scrollProgress < 0.18} />
          <ConsciousnessObject active={scrollProgress >= 0.18 && scrollProgress < 0.42} />
          <MemoryObject active={scrollProgress >= 0.42 && scrollProgress < 0.65} />
          <SystemsObject active={scrollProgress >= 0.65 && scrollProgress < 0.82} />
          <HumanityObject active={scrollProgress >= 0.82 && scrollProgress < 0.94} />
          <TransmissionObject active={scrollProgress >= 0.94} />

          {/* Post-processing Bloom glow */}
          {bloomEnabled && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.85}
                mipmapBlur
                radius={0.7}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
