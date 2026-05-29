'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DIST = 1.8; // units in front of camera

export default function TransitionFlash({ isTransitioning = false, color = '#ff6a00' }) {
  const ref      = useRef();
  const { camera, size } = useThree();
  const progress = useRef(0);
  const prev     = useRef(false);

  // Plane sized to exactly fill the frustum at DIST
  const [pw, ph] = useMemo(() => {
    const vFov = (camera.fov * Math.PI) / 180;
    const h    = 2 * Math.tan(vFov / 2) * DIST;
    return [h * (size.width / size.height), h];
  }, [camera.fov, size.width, size.height]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Rising edge — trigger full flash
    if (isTransitioning && !prev.current) progress.current = 1.0;
    prev.current = isTransitioning;

    // Decay — slower rate gives a longer, softer volumetric bloom
    if (progress.current > 0) {
      progress.current = Math.max(0, progress.current - delta * 2.5);
    }

    // Bell-curve opacity — restrained peak for cinematic subtlety
    const opacity = Math.sin(progress.current * Math.PI) * 0.22;
    ref.current.material.opacity = opacity;
    ref.current.visible = opacity > 0.001;

    // Attach to camera so it always fills the screen
    if (ref.current.visible) {
      ref.current.position.copy(state.camera.position);
      ref.current.quaternion.copy(state.camera.quaternion);
      ref.current.translateZ(-DIST);
    }
  });

  return (
    <mesh ref={ref} visible={false} renderOrder={999}>
      <planeGeometry args={[pw, ph]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
