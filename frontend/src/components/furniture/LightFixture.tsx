/**
 * LightFixture Component - Various light fixtures with emission
 */

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export interface LightFixtureProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  type?: "floor" | "table" | "ceiling" | "rgbStrip";
  color?: string;
  intensity?: number;
  on?: boolean;
}

export const LightFixture: React.FC<LightFixtureProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  type = "table",
  color = "#ffaa00",
  intensity = 1,
  on = true,
}) => {
  const meshRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial>>(null);

  // Animate RGB strip
  useFrame((state) => {
    if (type === "rgbStrip" && meshRef.current && on) {
      meshRef.current.material.emissive.setHSL(
        (state.clock.getElapsedTime() * 0.1) % 1,
        1,
        0.5
      );
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Point light */}
      <pointLight
        color={color}
        intensity={intensity}
        distance={8}
        castShadow
        visible={on}
      />

      {type === "floor" && (
        <>
          {/* Floor lamp base */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Pole */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.25, 0.3, 16, 1, true]} />
            <meshStandardMaterial
              color={on ? color : "#666666"}
              emissive={on ? color : "#000000"}
              emissiveIntensity={on ? 0.3 : 0}
              side={2}
              transparent
              opacity={0.9}
            />
          </mesh>
        </>
      )}

      {type === "table" && (
        <>
          {/* Table lamp base */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.25, 16, 1, true]} />
            <meshStandardMaterial
              color={on ? color : "#666666"}
              emissive={on ? color : "#000000"}
              emissiveIntensity={on ? 0.4 : 0}
              side={2}
              transparent
              opacity={0.85}
            />
          </mesh>
        </>
      )}

      {type === "ceiling" && (
        <>
          {/* Ceiling mount */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Shade/Globe */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={on ? color : "#666666"}
              emissive={on ? color : "#000000"}
              emissiveIntensity={on ? 0.5 : 0}
              side={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}

      {type === "rgbStrip" && (
        <>
          {/* Mounting base */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1, 0.05, 0.1]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          {/* RGB light strip */}
          <mesh
            ref={meshRef}
            position={[0, 0.03, 0]}
            castShadow
          >
            <boxGeometry args={[0.98, 0.02, 0.08]} />
            <meshStandardMaterial
              color={on ? "#ff0000" : "#330000"}
              emissive={on ? "#ff0000" : "#000000"}
              emissiveIntensity={on ? 0.8 : 0}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default LightFixture;
