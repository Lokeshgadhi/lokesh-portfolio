'use client';

import { useState, useEffect } from 'react';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  DepthOfField,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const CHROMA_OFFSET = new THREE.Vector2(0.0005, 0.0005);

export default function PostFX() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!ready) return null;

  return (
    <EffectComposer multisampling={0}>
      {/* Lens depth of field — focus on mid-scene, background buildings blur */}
      <DepthOfField
        focusDistance={0.018}
        focalLength={0.45}
        bokehScale={2.8}
        height={480}
      />

      {/* Bloom — neon glow on emissive surfaces (grid, beacons, orbs) */}
      <Bloom
        intensity={1.25}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.88}
        mipmapBlur
        radius={0.82}
      />

      {/* Lens chromatic aberration — subtle city-camera feel */}
      <ChromaticAberration
        offset={CHROMA_OFFSET}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Film grain — adds cinematic texture */}
      <Noise
        opacity={0.010}
        blendFunction={BlendFunction.ADD}
      />

      {/* Vignette — darkens edges, draws focus to center */}
      <Vignette
        eskil={false}
        offset={0.10}
        darkness={0.96}
      />
    </EffectComposer>
  );
}
