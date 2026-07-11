/**
 * DiningTable Component - Large table for eating/gathering
 */

import React from "react";
import type { FurnitureComponentProps } from "./FurnitureComponent";

export type DiningTableProps = Omit<FurnitureComponentProps, "children">;

export const DiningTable: React.FC<DiningTableProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const s = scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Table top */}
      <mesh position={[0, 0.75 * s, 0]}>
        <boxGeometry args={[2.5 * s, 0.1 * s, 1.5 * s]} />
        <meshStandardMaterial color="#6a5a4a" />
      </mesh>

      {/* Table legs */}
      <mesh position={[-1.1 * s, 0.375 * s, 0.6 * s]}>
        <boxGeometry args={[0.15 * s, 0.75 * s, 0.15 * s]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[1.1 * s, 0.375 * s, 0.6 * s]}>
        <boxGeometry args={[0.15 * s, 0.75 * s, 0.15 * s]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[-1.1 * s, 0.375 * s, -0.6 * s]}>
        <boxGeometry args={[0.15 * s, 0.75 * s, 0.15 * s]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[1.1 * s, 0.375 * s, -0.6 * s]}>
        <boxGeometry args={[0.15 * s, 0.75 * s, 0.15 * s]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>

      {/* Plates/utensils */}
      <mesh position={[-0.6 * s, 0.81 * s, 0.3 * s]}>
        <cylinderGeometry args={[0.12 * s, 0.12 * s, 0.02 * s, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6 * s, 0.81 * s, 0.3 * s]}>
        <cylinderGeometry args={[0.12 * s, 0.12 * s, 0.02 * s, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.6 * s, 0.81 * s, -0.3 * s]}>
        <cylinderGeometry args={[0.12 * s, 0.12 * s, 0.02 * s, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6 * s, 0.81 * s, -0.3 * s]}>
        <cylinderGeometry args={[0.12 * s, 0.12 * s, 0.02 * s, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Center piece */}
      <mesh position={[0, 0.85 * s, 0]}>
        <cylinderGeometry args={[0.15 * s, 0.12 * s, 0.15 * s, 8]} />
        <meshStandardMaterial color="#4a6a3a" />
      </mesh>
    </group>
  );
};

export default DiningTable;
