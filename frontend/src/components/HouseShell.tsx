import React from "react";
import type { Room } from "../types";
import { getEastExteriorWallSegments } from "../data/houseLayout";

interface HouseShellProps {
  rooms: Room[];
}

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}

const Wall: React.FC<WallProps> = ({ position, size, color = "#d8d0c2" }) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
  </mesh>
);

const DoorwayBoundary: React.FC<{
  axis: "x" | "z";
  boundary: number;
  center: number;
}> = ({ axis, boundary, center }) => {
  const wallHeight = 0.75;
  const segment = 3.6;
  const offset = 3.2;
  const thickness = 0.16;

  if (axis === "x") {
    return (
      <>
        <Wall position={[boundary, wallHeight / 2, center - offset]} size={[thickness, wallHeight, segment]} color="#aeb4bc" />
        <Wall position={[boundary, wallHeight / 2, center + offset]} size={[thickness, wallHeight, segment]} color="#aeb4bc" />
      </>
    );
  }

  return (
    <>
      <Wall position={[center - offset, wallHeight / 2, boundary]} size={[segment, wallHeight, thickness]} color="#aeb4bc" />
      <Wall position={[center + offset, wallHeight / 2, boundary]} size={[segment, wallHeight, thickness]} color="#aeb4bc" />
    </>
  );
};

export const HouseShell: React.FC<HouseShellProps> = ({ rooms }) => {
  const voiceRooms = rooms.filter((room) => room.isVoiceChannel);
  const voiceMinZ = voiceRooms.length > 0
    ? Math.min(...voiceRooms.map((room) => room.position.z - room.size.z / 2))
    : 0;
  const voiceMaxZ = voiceRooms.length > 0
    ? Math.max(...voiceRooms.map((room) => room.position.z + room.size.z / 2))
    : 0;
  const eastWallSegments = getEastExteriorWallSegments(voiceRooms);

  return (
    <group>
      {/* One shared foundation makes the nine rooms read as a single house. */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[30.5, 0.3, 30.5]} />
        <meshStandardMaterial color="#2d3445" roughness={0.9} />
      </mesh>

      {/* Exterior walls, with an open front door and an open garden patio edge. */}
      <Wall position={[0, 0.75, -15]} size={[30.3, 1.5, 0.28]} />
      <Wall position={[-15, 0.75, -5]} size={[0.28, 1.5, 20]} />
      {eastWallSegments.map((segment) => (
        <Wall
          key={`east-${segment.centerZ}`}
          position={[15, 0.75, segment.centerZ]}
          size={[0.28, 1.5, segment.length]}
        />
      ))}
      <Wall position={[-10.5, 0.75, 15]} size={[9, 1.5, 0.28]} />
      <Wall position={[-3.25, 0.75, 15]} size={[3.5, 1.5, 0.28]} />
      <Wall position={[3.25, 0.75, 15]} size={[3.5, 1.5, 0.28]} />
      <Wall position={[10, 0.75, 15]} size={[10, 1.5, 0.28]} />

      {/* Interior partitions: short walls plus wide door openings. */}
      {[-5, 5].flatMap((boundary) =>
        [-10, 0, 10].map((center) => (
          <DoorwayBoundary key={`v-${boundary}-${center}`} axis="x" boundary={boundary} center={center} />
        )),
      )}
      {[-5, 5].flatMap((boundary) =>
        [-10, 0, 10].map((center) => (
          <DoorwayBoundary key={`h-${boundary}-${center}`} axis="z" boundary={boundary} center={center} />
        )),
      )}

      {/* Front porch, path, and threshold clarify which room is the entrance. */}
      <mesh position={[0, -0.04, 16.4]} receiveShadow>
        <boxGeometry args={[5.2, 0.12, 2.5]} />
        <meshStandardMaterial color="#8b765f" roughness={0.95} />
      </mesh>
      {[18.2, 20.2, 22.2].map((z) => (
        <mesh key={z} position={[0, -0.03, z]} receiveShadow>
          <boxGeometry args={[2.4, 0.08, 1.1]} />
          <meshStandardMaterial color="#7d8390" roughness={1} />
        </mesh>
      ))}

      {/* Voice channels form an attached wing instead of floating display boxes. */}
      {voiceRooms.length > 0 && (
        <>
          <mesh position={[20, -0.16, (voiceMinZ + voiceMaxZ) / 2]} receiveShadow>
            <boxGeometry args={[10, 0.3, voiceMaxZ - voiceMinZ]} />
            <meshStandardMaterial color="#26384a" roughness={0.9} />
          </mesh>
          <Wall position={[25, 0.75, (voiceMinZ + voiceMaxZ) / 2]} size={[0.28, 1.5, voiceMaxZ - voiceMinZ]} color="#b9c8d3" />
          <Wall position={[20, 0.75, voiceMinZ]} size={[10, 1.5, 0.28]} color="#b9c8d3" />
          <Wall position={[20, 0.75, voiceMaxZ]} size={[10, 1.5, 0.28]} color="#b9c8d3" />
          {voiceRooms.slice(1).map((room) => (
            <DoorwayBoundary
              key={`voice-${room.id}`}
              axis="z"
              boundary={room.position.z - room.size.z / 2}
              center={20}
            />
          ))}
        </>
      )}
    </group>
  );
};

export default HouseShell;
