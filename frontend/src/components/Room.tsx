/**
 * Room Component - 3D Room in the house
 */

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Room as RoomType } from "../types";

interface RoomProps {
  room: RoomType;
  label?: boolean;
}

export const Room: React.FC<RoomProps> = ({ room, label = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (labelRef.current) {
      // Make label always face camera
      labelRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={[room.position.x, room.position.y, room.position.z]}>
      {/* Room floor */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[room.size.x, 0.2, room.size.z]} />
        <meshStandardMaterial
          color={room.color}
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Room walls (transparent) */}
      <group position={[0, room.size.y / 2, 0]}>
        {/* Front wall */}
        <mesh position={[0, 0, room.size.z / 2]}>
          <boxGeometry args={[room.size.x, room.size.y, 0.1]} />
          <meshStandardMaterial
            color={room.color}
            opacity={0.1}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Back wall */}
        <mesh position={[0, 0, -room.size.z / 2]}>
          <boxGeometry args={[room.size.x, room.size.y, 0.1]} />
          <meshStandardMaterial
            color={room.color}
            opacity={0.1}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Left wall */}
        <mesh position={[-room.size.x / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[room.size.z, room.size.y, 0.1]} />
          <meshStandardMaterial
            color={room.color}
            opacity={0.1}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Right wall */}
        <mesh position={[room.size.x / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[room.size.z, room.size.y, 0.1]} />
          <meshStandardMaterial
            color={room.color}
            opacity={0.1}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Room label */}
      {label && (
        <group ref={labelRef} position={[0, room.size.y + 0.5, 0]}>
          <mesh>
            <planeGeometry args={[room.size.x, 0.5]} />
            <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
          </mesh>
          {/* Note: Text would require TextGeometry or HTML overlay */}
        </group>
      )}

      {/* Room edges for better visibility */}
      <lineSegments>
        <edgesGeometry>
          <boxGeometry args={[room.size.x, room.size.y, room.size.z]} />
        </edgesGeometry>
        <lineBasicMaterial color={room.color} opacity={0.5} transparent />
      </lineSegments>
    </group>
  );
};

export default Room;
