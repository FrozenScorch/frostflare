import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { BufferGeometry, Mesh, MeshStandardMaterial } from 'three';


export interface TVProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  on?: boolean;
  frameColor?: string;
}

export const TV: React.FC<TVProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = 5,
  on = true,
  frameColor = '#1a1a1a',
}) => {
  const screenRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial>>(null);
  const scale = size / 50;

  useFrame((state) => {
    if (screenRef.current && on) {
      screenRef.current.material.emissiveIntensity =
        Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
    }
  });

  const screenDimensions = {
    width: 16 * scale,
    height: 9 * scale,
    depth: 0.1 * scale,
  };

  const frameDimensions = {
    width: 18 * scale,
    height: 10.2 * scale,
    depth: 0.3 * scale,
  };

  const standDimensions = {
    width: 6 * scale,
    height: 4 * scale,
    depth: 6 * scale,
  };

  return (
    <group position={position} rotation={rotation}>
      {/* TV Stand/Base */}
      <mesh position={[0, -screenDimensions.height / 2 - standDimensions.height / 2 - 0.5, 0]}>
        <boxGeometry args={[standDimensions.width, standDimensions.height, standDimensions.depth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* TV Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[frameDimensions.width, frameDimensions.height, frameDimensions.depth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* TV Screen */}
      <mesh
        ref={screenRef}
        position={[0, 0, frameDimensions.depth / 2 + screenDimensions.depth / 2]}
      >
        <boxGeometry args={[screenDimensions.width, screenDimensions.height, screenDimensions.depth]} />
        <meshStandardMaterial
          color={on ? '#3498db' : '#2c3e50'}
          emissive={on ? '#3498db' : '#000000'}
          emissiveIntensity={on ? 0.8 : 0}
        />
      </mesh>

      {/* Screen Border */}
      <mesh position={[0, 0, frameDimensions.depth / 2 + screenDimensions.depth / 2 + 0.01]}>
        <boxGeometry args={[screenDimensions.width + 0.1, screenDimensions.height + 0.1, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
    </group>
  );
};
