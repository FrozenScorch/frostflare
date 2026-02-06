/**
 * House3D Component - Main 3D scene with house and users
 */

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Sky, Environment } from "@react-three/drei";
import { ROOMS } from "../types";
import { Room } from "./Room";
import { UserAvatar } from "./UserAvatar";
import type { UserState } from "../types";

interface House3DProps {
  users: UserState[];
}

export const House3D: React.FC<House3DProps> = ({ users }) => {
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
          position: [30, 30, 30],
          fov: 60,
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Environment */}
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="sunset" />

        {/* Ground grid */}
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={80}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a2e" opacity={0.8} transparent />
        </mesh>

        {/* Rooms */}
        <Suspense fallback={null}>
          {ROOMS.map((room) => (
            <Room key={room.id} room={room} />
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
