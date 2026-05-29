'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

import InfinityGrid          from './InfinityGrid';
import CityBuildings         from './CityBuildings';
import FogLayers             from './FogLayers';
import SpaceParticles        from './SpaceParticles';
import BackgroundStructures  from './BackgroundStructures';
import EnvironmentController from './EnvironmentController';
import PostFX                from './PostFX';

function Scene({ scrollProgress, scrollVelocity }) {
  return (
    <>
      <color attach="background" args={['#000308']} />
      <fog   attach="fog"        args={['#000308', 14, 65]} />

      {/* Ground — perspective grid stretching to the horizon */}
      <InfinityGrid />

      {/* City skyline silhouettes in the distance */}
      <CityBuildings />

      {/* Atmospheric city haze / smog layers */}
      <FogLayers />

      {/* Bokeh-like floating light particles */}
      <SpaceParticles scrollVelocity={scrollVelocity} />

      {/* Polished metallic floating geometry above the city */}
      <BackgroundStructures />

      {/* Sparse stars — city light pollution keeps count low */}
      <Stars radius={90} depth={60} count={600} factor={2} fade speed={0.25} />

      {/* Camera animation, fog, and lighting per section */}
      <EnvironmentController scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />

      {/* Post-processing: DoF, bloom, grain, vignette */}
      <PostFX />
    </>
  );
}

export default function GlobalCanvas({
  scrollProgress = 0,
  scrollVelocity = 0,
}) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.2, 8.5], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Scene
          scrollProgress={scrollProgress}
          scrollVelocity={scrollVelocity}
        />
      </Canvas>
    </div>
  );
}
