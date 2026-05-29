'use client';

import { useMemo } from 'react';

// Seeded LCG for stable SSR/client rendering
function seededRand(seed) {
  let s = seed;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

const GRID_Y = -2.8;

export default function CityBuildings() {
  const buildings = useMemo(() => {
    const r = seededRand(77);
    const result = [];

    for (let i = 0; i < 55; i++) {
      const x      = (r() - 0.5) * 110;
      const z      = -22 - r() * 60;
      const w      = 1.2 + r() * 3.5;
      const d      = 1.2 + r() * 3.5;
      const h      = 3   + r() * 20;
      const posY   = GRID_Y + h / 2;

      // Some buildings get a rooftop beacon
      const beacon     = r() > 0.55;
      const beaconClr  = r() > 0.5 ? '#06b6d4' : '#a855f7';

      // Window emissive: deep navy or deep violet
      const winClr = r() > 0.5 ? '#001533' : '#120015';

      result.push({ key: i, x, z, w, d, h, posY, beacon, beaconClr, winClr });
    }
    return result;
  }, []);

  return (
    <group>
      {buildings.map((b) => (
        <group key={b.key}>
          {/* Building body */}
          <mesh position={[b.x, b.posY, b.z]} scale={[b.w, b.h, b.d]}>
            <boxGeometry />
            <meshStandardMaterial
              color="#020308"
              emissive={b.winClr}
              emissiveIntensity={0.6}
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>

          {/* Rooftop beacon antenna */}
          {b.beacon && (
            <mesh position={[b.x, GRID_Y + b.h + 0.6, b.z]}>
              <boxGeometry args={[0.06, 1.2, 0.06]} />
              <meshStandardMaterial
                color={b.beaconClr}
                emissive={b.beaconClr}
                emissiveIntensity={4}
                transparent
                opacity={0.92}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
