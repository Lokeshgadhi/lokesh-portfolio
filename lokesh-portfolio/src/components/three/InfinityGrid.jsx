'use client';

import { Grid } from '@react-three/drei';

export default function InfinityGrid() {
  return (
    <Grid
      position={[0, -2.8, 0]}
      cellSize={1.2}
      cellThickness={0.4}
      cellColor="#051e36"
      sectionSize={6}
      sectionThickness={0.9}
      sectionColor="#0a4a8a"
      fadeDistance={65}
      fadeStrength={3.5}
      infiniteGrid
      followCamera
    />
  );
}
