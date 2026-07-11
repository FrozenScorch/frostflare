/**
 * Desk Component - Office desk for working/typing
 */

import React from "react";
import type { FurnitureComponentProps } from "./FurnitureComponent";

export type DeskProps = Omit<FurnitureComponentProps, "children">;

export const Desk: React.FC<DeskProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const s = scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75 * s, 0]}>
        <boxGeometry args={[2 * s, 0.1 * s, 1 * s]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>

      {/* Desk legs */}
      <mesh position={[-0.9 * s, 0.375 * s, 0.4 * s]}>
        <boxGeometry args={[0.1 * s, 0.75 * s, 0.1 * s]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[0.9 * s, 0.375 * s, 0.4 * s]}>
        <boxGeometry args={[0.1 * s, 0.75 * s, 0.1 * s]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[-0.9 * s, 0.375 * s, -0.4 * s]}>
        <boxGeometry args={[0.1 * s, 0.75 * s, 0.1 * s]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[0.9 * s, 0.375 * s, -0.4 * s]}>
        <boxGeometry args={[0.1 * s, 0.75 * s, 0.1 * s]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>

      {/* Computer monitor */}
      <mesh position={[0, 1.1 * s, -0.3 * s]}>
        <boxGeometry args={[0.8 * s, 0.5 * s, 0.05 * s]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 1.05 * s, -0.32 * s]}>
        <boxGeometry args={[0.3 * s, 0.35 * s, 0.02 * s]} />
        <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.81 * s, 0.1 * s]}>
        <boxGeometry args={[0.5 * s, 0.02 * s, 0.2 * s]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

export default Desk;
