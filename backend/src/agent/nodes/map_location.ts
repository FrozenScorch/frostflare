/**
 * Map Location Node - Determines user positions in rooms
 */

import type { StateAnnotation } from "../state.js";

// Room center positions in 3D space
const ROOM_POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  entrance: { x: 0, y: 0, z: 0 },
  living_room: { x: 10, y: 0, z: 10 },
  game_room: { x: -10, y: 0, z: 10 },
  kitchen: { x: 10, y: 0, z: -10 },
  library: { x: -10, y: 0, z: -10 },
  media_room: { x: 20, y: 0, z: 0 },
  music_room: { x: -20, y: 0, z: 0 },
  garden: { x: 0, y: 0, z: 20 },
  bedroom: { x: 0, y: 0, z: -20 },
};

// Room bounds for spawning users within rooms
const ROOM_BOUNDS: Record<string, { width: number; depth: number }> = {
  entrance: { width: 8, depth: 8 },
  living_room: { width: 12, depth: 12 },
  game_room: { width: 10, depth: 10 },
  kitchen: { width: 8, depth: 8 },
  library: { width: 10, depth: 10 },
  media_room: { width: 10, depth: 8 },
  music_room: { width: 8, depth: 8 },
  garden: { width: 15, depth: 15 },
  bedroom: { width: 10, depth: 10 },
};

/**
 * Map location node determines where users should be positioned
 */
export async function mapLocationNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users } = state;
  const updatedUsers = new Map(users);

  // Group users by room
  const usersByRoom = new Map<string, any[]>();
  for (const [_userId, user] of updatedUsers.entries()) {
    const room = user.currentRoom;
    if (!usersByRoom.has(room)) {
      usersByRoom.set(room, []);
    }
    usersByRoom.get(room)!.push(user);
  }

  // Position users in their rooms
  for (const [room, roomUsers] of usersByRoom.entries()) {
    await positionUsersInRoom(room, roomUsers);
  }

  console.log(`[MapLocation] Positioned ${users.size} users in rooms`);

  return {
    users: updatedUsers,
  };
}

/**
 * Position users within a room using circle packing
 */
async function positionUsersInRoom(room: string, users: any[]): Promise<void> {
  const roomCenter = ROOM_POSITIONS[room];
  const bounds = ROOM_BOUNDS[room];

  if (!roomCenter || !bounds) {
    console.warn(`[MapLocation] Unknown room: ${room}`);
    return;
  }

  // Simple circular arrangement
  const radius = Math.min(bounds.width, bounds.depth) / 3;
  const centerX = roomCenter.x;
  const centerZ = roomCenter.z;

  users.forEach((user, index) => {
    if (users.length === 1) {
      // Single user at center
      user.targetPosition = {
        x: centerX,
        y: 0,
        z: centerZ,
      };
    } else {
      // Multiple users in circle
      const angle = (2 * Math.PI * index) / users.length;
      user.targetPosition = {
        x: centerX + radius * Math.cos(angle),
        y: 0,
        z: centerZ + radius * Math.sin(angle),
      };
    }

    // Set animation if moving
    const distance = Math.sqrt(
      Math.pow(user.targetPosition.x - user.position.x, 2) +
        Math.pow(user.targetPosition.z - user.position.z, 2)
    );

    if (distance > 0.5) {
      user.action = "walking";
      user.animation = "walk";
    } else {
      // Already at target, update current position
      user.position = { ...user.targetPosition };
    }

    console.log(
      `[MapLocation] ${user.username} positioned in ${room} at (${user.targetPosition.x.toFixed(1)}, ${user.targetPosition.z.toFixed(1)})`
    );
  });
}
