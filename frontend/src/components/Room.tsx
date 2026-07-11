/**
 * Room Component - 3D Room in the house with room-specific lighting
 */

import React, { useRef, useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GamingPC, Couch, Table, LightFixture, Plant, TV, Chair, Bookshelf } from "./furniture";
import { Desk } from "./furniture/Desk";
import { DiningTable } from "./furniture/DiningTable";
import { Speaker } from "./furniture/Speaker";
import { Bed } from "./furniture/Bed";
import type { Room as RoomConfig, UserState } from "../types";

interface RoomProps {
  room: RoomConfig;
  users: UserState[];
  label?: boolean;
}

export const Room: React.FC<RoomProps> = ({ room, users, label = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Get users in this room and their unique actions
  const roomActions = useMemo(() => {
    const actionsInRoom = new Set<string>();
    const usersInRoom: string[] = [];
    users.forEach(user => {
      if (user.currentRoom === room.id || user.voiceChannelId === room.id) {
        actionsInRoom.add(user.action);
        usersInRoom.push(user.username);
      }
    });
    return actionsInRoom;
  }, [users, room.id]);

  // Room-specific lighting configurations
  const getRoomLighting = (roomId: RoomConfig["id"]) => {
    switch (roomId) {
      case "game_room":
        return (
          <>
            <pointLight position={[0, 2.5, 0]} intensity={1.2} color="#8844ff" distance={8} />
            <pointLight position={[2, 2, 2]} intensity={0.8} color="#44aaff" distance={6} />
            <pointLight position={[-2, 2, -2]} intensity={0.8} color="#ff44aa" distance={6} />
          </>
        );

      case "living_room":
        return (
          <>
            <ambientLight intensity={0.4} color="#ffeebb" />
            <pointLight position={[2, 2, 2]} intensity={0.8} color="#ffaa66" distance={6} />
            <pointLight position={[-2, 1.5, 0]} intensity={0.4} color="#ffcc88" distance={4} />
          </>
        );

      case "media_room":
        return (
          <>
            <ambientLight intensity={0.15} color="#333366" />
            <pointLight position={[0, 2.5, room.size.z / 2 - 0.5]} intensity={1.5} color="#4466ff" distance={10} />
            <pointLight position={[0, 2.5, 0]} intensity={0.3} color="#222244" distance={5} />
          </>
        );

      case "library":
        return (
          <>
            <ambientLight intensity={0.3} color="#ffeecc" />
            <pointLight position={[0, 2.5, 0]} intensity={1} color="#ffcc88" distance={5} />
            <spotLight position={[2, 2.5, 2]} angle={0.3} penumbra={0.5} intensity={0.6} color="#ffdd99" />
          </>
        );

      case "kitchen":
        return (
          <>
            <ambientLight intensity={0.5} color="#ffffff" />
            <pointLight position={[0, 2.8, 0]} intensity={1.2} color="#ffffff" distance={12} />
            <pointLight position={[room.size.x / 2 - 1, 1.5, 0]} intensity={0.4} color="#ffffee" distance={3} />
            <pointLight position={[-room.size.x / 2 + 1, 1.5, 0]} intensity={0.4} color="#ffffee" distance={3} />
          </>
        );

      case "music_room":
        return (
          <>
            <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#ff6644" distance={7} />
            <pointLight position={[2, 1.5, 0]} intensity={0.5} color="#44ff88" distance={5} />
            <pointLight position={[-2, 2, 2]} intensity={0.5} color="#4488ff" distance={5} />
            <spotLight position={[0, 2.8, 0]} angle={0.5} penumbra={0.3} intensity={0.4} color="#ffffff" />
          </>
        );

      case "garden":
        return (
          <>
            <ambientLight intensity={0.5} color="#ddffdd" />
            <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffee" />
            <hemisphereLight args={["#aaddff", "#55aa55", 0.4]} />
          </>
        );

      case "bedroom":
        return (
          <>
            <ambientLight intensity={0.2} color="#ffddbb" />
            <pointLight position={[2, 1.5, 2]} intensity={0.6} color="#ffaa66" distance={4} />
            <pointLight position={[-2, 1.5, -2]} intensity={0.6} color="#ffaa66" distance={4} />
          </>
        );

      case "entrance":
        return (
          <>
            <ambientLight intensity={0.4} color="#f0f0f0" />
            <pointLight position={[0, 2.5, 0]} intensity={0.7} color="#ffffff" distance={6} />
            <hemisphereLight args={["#ffffff", "#888888", 0.2]} />
          </>
        );

      default:
        return <ambientLight intensity={0.3} />;
    }
  };

  // Room-specific furniture - dynamic based on user actions
  const getRoomFurniture = (roomId: RoomConfig["id"], roomSize: { x: number; z: number }, roomActions: Set<string>) => {
    // Helper to check if any user in room has a specific action
    const hasAction = (action: string) => roomActions.has(action);

    // Handle lobby (Main Lobby)
    if (roomId === "lobby") {
      return (
        <>
          {/* Main seating area - couches for conversation/talking */}
          {(hasAction("talking") || hasAction("idle")) && (
            <>
              <Couch position={[0, 0, 0]} size="sectional" color="#4a5a6a" />
              <Table type="coffee" position={[0, 0, 2]} />
            </>
          )}

          {/* Desk areas for working/typing users */}
          {hasAction("typing") && (
            <>
              <Desk position={[-8, 0, -8]} scale={1} />
              <Chair type="office" position={[-8, 0, -6.5]} color="#3a3a4a" />
              <Desk position={[-5, 0, -8]} scale={1} />
              <Chair type="office" position={[-5, 0, -6.5]} color="#4a3a4a" />
              <Desk position={[8, 0, -8]} scale={1} />
              <Chair type="office" position={[8, 0, -6.5]} color="#3a3a4a" />
              <Desk position={[5, 0, -8]} scale={1} />
              <Chair type="office" position={[5, 0, -6.5]} color="#4a3a4a" />
            </>
          )}

          {/* Side seating areas for talking/idle */}
          {(hasAction("talking") || hasAction("idle")) && (
            <>
              <Couch position={[-8, 0, 5]} size="3-seater" color="#5a4a6a" />
              <Table type="coffee" position={[-8, 0, 7]} />
              <Couch position={[8, 0, 5]} size="3-seater" color="#5a4a6a" />
              <Table type="coffee" position={[8, 0, 7]} />
            </>
          )}

          {/* TV area for watching - show only if users are watching */}
          {hasAction("watching") && (
            <TV position={[0, 0, -12]} size={5} on={true} />
          )}

          {/* Gaming setups - show only if users are gaming */}
          {hasAction("gaming") && (
            <>
              <GamingPC position={[10, 0, 8]} rgbColor="#ff0000" />
              <Chair type="gaming" position={[10, 0, 9.5]} color="#1a1a2e" />
              <GamingPC position={[-10, 0, 8]} rgbColor="#00ff00" />
              <Chair type="gaming" position={[-10, 0, 9.5]} color="#2a1a2e" />
            </>
          )}

          {/* Dining area for eating - show only if users are eating */}
          {hasAction("eating") && (
            <>
              <DiningTable position={[0, 0, 8]} scale={1} />
              <Chair type="dining" position={[-1.5, 0, 7]} color="#4a3a2a" />
              <Chair type="dining" position={[1.5, 0, 7]} color="#4a3a2a" />
              <Chair type="dining" position={[-1.5, 0, 9]} color="#4a3a2a" />
              <Chair type="dining" position={[1.5, 0, 9]} color="#4a3a2a" />
            </>
          )}

          {/* Speakers for listening - show only if users are listening */}
          {hasAction("listening") && (
            <>
              <Speaker position={[-12, 0, 0]} scale={1} on={true} />
              <Speaker position={[12, 0, 0]} scale={1} on={true} />
            </>
          )}

          {/* Reading areas - show only if users are reading */}
          {hasAction("reading") && (
            <>
              <Couch position={[0, 0, 12]} size="2-seater" color="#6a5a5a" />
              <LightFixture type="table" position={[2, 1.2, 12]} color="#ffcc88" intensity={0.8} />
              <Bookshelf position={[-3, 0, 11]} width={1.5} filled={true} />
            </>
          )}

          {/* Bedroom furniture for sleeping - show only if users are sleeping */}
          {hasAction("sleeping") && (
            <>
              <Bed position={[0, 0, -10]} size="queen" />
            </>
          )}

          {/* Plants for ambiance - always show */}
          <Plant type="ficus" position={[-11, 0, 0]} size={1.3} />
          <Plant type="ficus" position={[11, 0, 0]} size={1.3} />
          <Plant type="monstera" position={[-11, 0, 12]} size={1.1} />
          <Plant type="monstera" position={[11, 0, 12]} size={1.1} />
          <Plant type="succulent" position={[0, 0, 14]} size={0.6} />
          <Plant type="succulent" position={[0, 0, -14]} size={0.6} />
          <Plant type="snake" position={[12, 0, -8]} size={0.8} />
          <Plant type="snake" position={[-12, 0, -8]} size={0.8} />

          {/* Additional scattered chairs for general seating */}
          {(hasAction("talking") || hasAction("idle")) && (
            <>
              <Chair type="office" position={[-6, 0, 3]} color="#5a5a6a" />
              <Chair type="office" position={[6, 0, 3]} color="#5a5a6a" />
            </>
          )}
        </>
      );
    }

    // Handle voice channel rooms (dynamic rooms with custom IDs)
    if (roomId.startsWith("lobby") === false && !Object.values({
      game_room: "game_room",
      living_room: "living_room",
      media_room: "media_room",
      library: "library",
      kitchen: "kitchen",
      music_room: "music_room",
      garden: "garden",
      bedroom: "bedroom",
      entrance: "entrance"
    }).includes(roomId)) {
      // This is a voice channel room - add activity-based furniture
      const roomWidth = roomSize.x;
      const roomDepth = roomSize.z;
      const centerX = 0;
      const centerZ = 0;

      // Calculate chair positions in a circle based on room size
      const numChairs = Math.max(3, Math.min(6, Math.floor(roomDepth / 2)));
      const chairRadius = Math.min(roomWidth, roomDepth) * 0.3;

      const chairs = [];
      for (let i = 0; i < numChairs; i++) {
        const angle = (i / numChairs) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * chairRadius;
        const z = centerZ + Math.sin(angle) * chairRadius;
        chairs.push(
          <Chair
            key={`chair-${i}`}
            type="office"
            position={[x, 0, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
            color="#3a3a4a"
          />
        );
      }

      return (
        <>
          {/* Central table for voice channel room - always show for conversation */}
          <Table
            type="coffee"
            position={[centerX, 0, centerZ]}
            scale={Math.min(roomWidth, roomDepth) * 0.15}
          />

          {/* Chairs arranged in circle */}
          {chairs}

          {/* Add desks for typing/working users */}
          {hasAction("typing") && numChairs > 3 && (
            <>
              <Desk position={[-3, 0, -2]} scale={0.8} />
              <Chair type="office" position={[-3, 0, -0.7]} color="#3a3a4a" />
              <Desk position={[3, 0, -2]} scale={0.8} />
              <Chair type="office" position={[3, 0, -0.7]} color="#3a3a4a" />
            </>
          )}

          {/* Decorative plants - always show */}
          <Plant type="succulent" position={[roomWidth / 2 - 1, 0, roomDepth / 2 - 1]} size={0.5} />
          <Plant type="succulent" position={[-roomWidth / 2 + 1, 0, -roomDepth / 2 + 1]} size={0.5} />
          <Plant type="ficus" position={[roomWidth / 2 - 1, 0, -roomDepth / 2 + 1]} size={0.7} />

          {/* Speaker for voice channel - only show if users are listening */}
          {hasAction("listening") && (
            <Speaker position={[0, 0, roomDepth / 2 - 1.5]} scale={0.8} on={true} />
          )}
        </>
      );
    }

    // Original room type furniture - now activity-based
    switch (roomId) {
      case "game_room":
        return (
          <>
            {/* Gaming setups - only show if users are gaming */}
            {hasAction("gaming") && (
              <>
                <GamingPC position={[-2, 0, -1.5]} rgbColor="#00ff00" />
                <Chair type="gaming" position={[-2, 0, -0.5]} color="#1a1a2e" />
                <GamingPC position={[0, 0, -1.5]} rgbColor="#ff00ff" />
                <Chair type="gaming" position={[0, 0, -0.5]} color="#2a1a2e" />
                <GamingPC position={[2, 0, -1.5]} rgbColor="#00ffff" />
                <Chair type="gaming" position={[2, 0, -0.5]} color="#1a2a2e" />
              </>
            )}
            {/* Seating for talking/idle */}
            {(hasAction("talking") || hasAction("idle")) && (
              <Couch position={[0, 0, 1.5]} size="2-seater" color="#4a4a6a" />
            )}
            {/* Decor */}
            <Plant type="succulent" position={[2.5, 0, 1.5]} size={0.5} />
          </>
        );

      case "living_room":
        return (
          <>
            {/* Seating for talking/idle */}
            {(hasAction("talking") || hasAction("idle")) && (
              <>
                <Couch position={[0, 0, 0]} size="sectional" color="#4a4a6a" />
                <Table type="coffee" position={[0, 0, 1.2]} />
              </>
            )}
            {/* TV only if users are watching */}
            {hasAction("watching") && (
              <TV position={[0, 0, -2]} size={6} on={true} />
            )}
            <Plant type="ficus" position={[2, 0, 2]} />
            {/* Chairs for typing */}
            {hasAction("typing") && (
              <>
                <Chair type="office" position={[-1.5, 0, 1.5]} color="#3a3a3a" />
                <Chair type="office" position={[1.5, 0, 1.5]} color="#3a3a3a" />
              </>
            )}
            <Plant type="monstera" position={[-2, 0, 2]} size={1.2} />
          </>
        );

      case "media_room":
        return (
          <>
            {/* Seating for watching/talking */}
            {(hasAction("watching") || hasAction("talking") || hasAction("idle")) && (
              <>
                <Couch position={[0, 0, 1]} size="3-seater" color="#2a2a3a" />
                <Chair type="gaming" position={[-1.5, 0, 0]} color="#2a1a1a" />
                <Chair type="gaming" position={[1.5, 0, 0]} color="#2a1a1a" />
              </>
            )}
            {/* TV only if users are watching */}
            {hasAction("watching") && (
              <TV position={[0, 0, -2]} size={8} on={true} frameColor="#333333" />
            )}
            <Table type="coffee" position={[0, 0, -1]} scale={0.8} />
          </>
        );

      case "library":
        return (
          <>
            {/* Desk and chair for typing/reading */}
            {(hasAction("typing") || hasAction("reading")) && (
              <>
                <Table type="desk" position={[-2, 0, -1]} />
                <Chair type="office" position={[-2, 0, -0.2]} color="#5a4a3a" />
              </>
            )}
            {/* Couch for reading/idle */}
            {(hasAction("reading") || hasAction("idle")) && (
              <Couch position={[1.5, 0, 0]} size="2-seater" color="#6a5a4a" />
            )}
            {/* Reading light if users are reading */}
            {hasAction("reading") && (
              <LightFixture type="table" position={[-2, 1, -1]} color="#ffcc88" intensity={1.2} />
            )}
            <Plant type="monstera" position={[2, 0, 2]} />
            <Bookshelf position={[-2.5, 0, 1]} width={2} filled={true} />
            <Bookshelf position={[2.5, 0, 1]} width={2} filled={true} />
          </>
        );

      case "kitchen":
        return (
          <>
            {/* Dining table for eating */}
            {hasAction("eating") && (
              <>
                <Table type="dining" position={[0, 0, 0]} />
                <Chair type="dining" position={[-1, 0, 0.5]} color="#4a3a2a" />
                <Chair type="dining" position={[1, 0, 0.5]} color="#4a3a2a" />
                <Chair type="dining" position={[-1, 0, -0.5]} color="#4a3a2a" />
                <Chair type="dining" position={[1, 0, -0.5]} color="#4a3a2a" />
              </>
            )}
            <Plant type="succulent" position={[2, 0, -2]} size={0.6} />
          </>
        );

      case "music_room":
        return (
          <>
            {/* Couch for listening/idle */}
            {(hasAction("listening") || hasAction("idle")) && (
              <Couch position={[0, 0, 1.5]} size="2-seater" color="#5a4a6a" />
            )}
            {/* Speakers only if users are listening */}
            {hasAction("listening") && (
              <>
                <Speaker position={[-2, 0, -1]} scale={1} on={true} />
                <Speaker position={[2, 0, -1]} scale={1} on={true} />
              </>
            )}
            <Chair type="office" position={[-1.5, 0, -1]} color="#3a3a4a" />
            <Chair type="office" position={[1.5, 0, -1]} color="#3a3a4a" />
          </>
        );

      case "garden":
        return (
          <>
            <Plant type="ficus" position={[-2, 0, -2]} size={1.5} />
            <Plant type="ficus" position={[2, 0, 2]} size={1.3} />
            <Plant type="succulent" position={[0, 0, 2]} size={0.8} />
            <Plant type="snake" position={[2, 0, -1.5]} size={1} />
            <Plant type="monstera" position={[-2, 0, 1]} size={1.2} />
            {/* Couch for idle/relaxing */}
            {(hasAction("idle") || hasAction("reading")) && (
              <Couch position={[0, 0, 0]} size="2-seater" color="#5a6a4a" />
            )}
          </>
        );

      case "bedroom":
        return (
          <>
            {/* Bed for sleeping */}
            {hasAction("sleeping") && (
              <Bed position={[0, 0, 0]} size="queen" />
            )}
            {/* Desks for typing */}
            {hasAction("typing") && (
              <>
                <Table type="desk" position={[-1.8, 0, -1]} scale={0.5} />
                <Chair type="office" position={[-1.8, 0, -0.3]} color="#4a4a5a" />
                <Table type="desk" position={[1.8, 0, -1]} scale={0.5} />
                <Chair type="office" position={[1.8, 0, -0.3]} color="#4a4a5a" />
              </>
            )}
            {/* Nightstand lights if reading or sleeping */}
            {(hasAction("reading") || hasAction("sleeping")) && (
              <>
                <LightFixture type="table" position={[-1.8, 0.5, -1]} color="#ffaa66" intensity={0.8} />
                <LightFixture type="table" position={[1.8, 0.5, -1]} color="#ffaa66" intensity={0.8} />
              </>
            )}
            <Plant type="succulent" position={[2, 0, 2]} size={0.6} />
            <Plant type="succulent" position={[-2, 0, 2]} size={0.6} />
          </>
        );

      case "entrance":
        return (
          <>
            <Table type="coffee" position={[0, 0, 1]} scale={0.6} />
            <Plant type="monstera" position={[2, 0, -1]} size={0.9} />
            <Plant type="ficus" position={[-2, 0, 1]} size={1} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <group position={[room.position.x, room.position.y, room.position.z]}>
      {/* Room-specific lighting */}
      {getRoomLighting(room.id)}

      {/* Room-specific furniture - dynamic based on user activities */}
      {getRoomFurniture(room.id, { x: room.size.x, z: room.size.z }, roomActions)}

      {/* Contact shadows removed to prevent texture unit overflow */}

      {/* Room floor with enhanced materials */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[room.size.x, room.size.z]} />
        <meshBasicMaterial
          color={room.color}
          opacity={0.4}
          transparent
        />
      </mesh>

      {/* Room base/thickness */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[room.size.x, 0.2, room.size.z]} />
        <meshBasicMaterial
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
          <meshBasicMaterial
            color={room.color}
            opacity={0.08}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Back wall */}
        <mesh position={[0, 0, -room.size.z / 2]}>
          <boxGeometry args={[room.size.x, room.size.y, 0.1]} />
          <meshBasicMaterial
            color={room.color}
            opacity={0.08}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Left wall */}
        <mesh position={[-room.size.x / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[room.size.z, room.size.y, 0.1]} />
          <meshBasicMaterial
            color={room.color}
            opacity={0.08}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Right wall */}
        <mesh position={[room.size.x / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[room.size.z, room.size.y, 0.1]} />
          <meshBasicMaterial
            color={room.color}
            opacity={0.08}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Room name label */}
      {label && (
        <Html position={[0, room.size.y + 0.5, 0]} center distanceFactor={10}>
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 6px #000000, 0 0 12px #000000',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {room.name}
          </div>
        </Html>
      )}

      {/* Room edges for better visibility */}
      <lineSegments>
        <edgesGeometry>
          <boxGeometry args={[room.size.x, room.size.y, room.size.z]} />
        </edgesGeometry>
        <lineBasicMaterial color={room.color} opacity={0.6} transparent linewidth={2} />
      </lineSegments>
    </group>
  );
};

export default Room;
