/**
 * House3D Component - Main 3D scene with dynamic voice channel rooms
 */

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Room } from "./Room";
import { UserAvatar } from "./UserAvatar";
import type { UserState, Room as RoomConfig } from "../types";

interface House3DProps {
  users: UserState[];
  rooms: RoomConfig[];
}

export const House3D: React.FC<House3DProps> = ({ users, rooms }) => {

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <Canvas
        camera={{
          position: [2.5, 31, 38],
          fov: 64,
        }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          // CRITICAL: Enable object sorting to prevent flickering and material errors
          sortObjects: true,
          // Proper shadow and color space configuration
          shadowMapEnabled: true,
          outputColorSpace: THREE.SRGBColorSpace,
          // Optimize pixel ratio for performance
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <hemisphereLight
          args={["#ffffff", "#444444", 0.4]}
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#1a1a2e" opacity={0.8} transparent />
        </mesh>

        {/* Dynamic Rooms */}
        <Suspense fallback={null}>
          {rooms.map((room) => (
            <Room key={room.id} room={room} users={users} />
          ))}
        </Suspense>

        {/* User Avatars */}
        <Suspense fallback={null}>
          {users.map((user) => (
            <UserAvatar key={user.id} user={user} />
          ))}
        </Suspense>

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          target={[2.5, 0, 1]}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}
          maxDistance={80}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Instructions overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#888",
          fontSize: "12px",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div>
          🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
        </div>
      </div>
    </div>
  );
};

export default House3D;
