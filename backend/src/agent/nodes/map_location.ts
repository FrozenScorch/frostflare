/**
 * Map Location Node - Determines user positions in rooms using LLM-guided spatial analysis
 */

import type { StateAnnotation, Vector3D, UserState, SpatialAnalysisData } from "../state.js";

// Room center positions in 3D space (MUST MATCH frontend App.tsx positions)
const ROOM_POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  unknown: { x: 0, y: 0, z: -10 }, // Default to living room
  entrance: { x: 0, y: 0, z: 0 },
  game_room: { x: -15, y: 0, z: -10 },
  living_room: { x: 0, y: 0, z: -10 },
  media_room: { x: 15, y: 0, z: -10 },
  kitchen: { x: -15, y: 0, z: 5 },
  library: { x: 0, y: 0, z: 5 },
  music_room: { x: 15, y: 0, z: 5 },
  garden: { x: -7.5, y: 0, z: 15 },
  bedroom: { x: 10, y: 0, z: 15 },
};

// Room bounds for spawning users within rooms
const ROOM_BOUNDS: Record<string, { width: number; depth: number }> = {
  unknown: { width: 12, depth: 12 }, // Default to living room bounds
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

// Furniture locations within each room (relative to room center)
const ROOM_FURNITURE: Record<string, Array<{ type: string; position: Vector3D; radius: number }>> = {
  living_room: [
    { type: "sofa", position: { x: 0, y: 0, z: 2 }, radius: 2 },
    { type: "coffee_table", position: { x: 0, y: 0, z: 0 }, radius: 1 },
    { type: "armchair", position: { x: -3, y: 0, z: -2 }, radius: 1.5 },
    { type: "armchair", position: { x: 3, y: 0, z: -2 }, radius: 1.5 },
    { type: "tv_stand", position: { x: 0, y: 0, z: -4 }, radius: 1 },
  ],
  game_room: [
    { type: "gaming_console", position: { x: 0, y: 0, z: 0 }, radius: 1.5 },
    { type: "couch", position: { x: 0, y: 0, z: 3 }, radius: 2 },
    { type: "chair", position: { x: -2, y: 0, z: 1 }, radius: 1 },
    { type: "chair", position: { x: 2, y: 0, z: 1 }, radius: 1 },
  ],
  kitchen: [
    { type: "counter", position: { x: -3, y: 0, z: 0 }, radius: 1.5 },
    { type: "table", position: { x: 2, y: 0, z: 0 }, radius: 1.5 },
    { type: "stool", position: { x: 1, y: 0, z: 1 }, radius: 0.8 },
    { type: "stool", position: { x: 2, y: 0, z: 1 }, radius: 0.8 },
    { type: "stool", position: { x: 3, y: 0, z: 1 }, radius: 0.8 },
  ],
  library: [
    { type: "desk", position: { x: 0, y: 0, z: 0 }, radius: 1.5 },
    { type: "bookshelf", position: { x: -4, y: 0, z: 0 }, radius: 1 },
    { type: "armchair", position: { x: 2, y: 0, z: 3 }, radius: 1.5 },
    { type: "reading_table", position: { x: 3, y: 0, z: 0 }, radius: 1.2 },
  ],
  media_room: [
    { type: "sofa", position: { x: 0, y: 0, z: 3 }, radius: 2 },
    { type: "screen", position: { x: 0, y: 0, z: -3 }, radius: 1 },
    { type: "speaker_left", position: { x: -4, y: 0, z: 0 }, radius: 0.5 },
    { type: "speaker_right", position: { x: 4, y: 0, z: 0 }, radius: 0.5 },
  ],
  music_room: [
    { type: "piano", position: { x: 0, y: 0, z: -2 }, radius: 2 },
    { type: "guitar_stand", position: { x: 3, y: 0, z: 0 }, radius: 1 },
    { type: "speaker", position: { x: -3, y: 0, z: 2 }, radius: 1 },
  ],
  garden: [
    { type: "bench", position: { x: 0, y: 0, z: 0 }, radius: 2 },
    { type: "fountain", position: { x: 3, y: 0, z: 3 }, radius: 1.5 },
    { type: "plant", position: { x: -4, y: 0, z: -2 }, radius: 0.8 },
    { type: "plant", position: { x: 4, y: 0, z: -2 }, radius: 0.8 },
  ],
  bedroom: [
    { type: "bed", position: { x: 0, y: 0, z: 2 }, radius: 2 },
    { type: "desk", position: { x: -3, y: 0, z: -2 }, radius: 1.5 },
    { type: "chair", position: { x: -3, y: 0, z: -0.5 }, radius: 1 },
  ],
  entrance: [
    { type: "coat_rack", position: { x: -2, y: 0, z: 0 }, radius: 0.8 },
    { type: "shoe_rack", position: { x: 2, y: 0, z: 0 }, radius: 1 },
  ],
};

// Mapping from activity types to preferred furniture types
const ACTIVITY_FURNITURE: Record<string, string[]> = {
  chatting: ["sofa", "armchair", "couch", "bench"],
  gaming: ["gaming_console", "chair", "couch"],
  voice_chat: ["sofa", "armchair", "couch"],
  listening_music: ["speaker", "armchair", "sofa"],
  watching_video: ["sofa", "couch"],
  working: ["desk", "table"],
  studying: ["desk", "reading_table", "table"],
  eating: ["table", "counter", "stool"],
  sleeping: ["bed"],
  typing: ["desk", "table"],
  unknown: ["sofa", "armchair", "couch", "bench"],
};

// Default social distance for users not in spatial analysis
const DEFAULT_SOCIAL_DISTANCE = 2.0;
const MIN_DISTANCE = 1.0; // Minimum distance to prevent overlap
const MAX_DISTANCE = 5.0; // Maximum distance for social distancing

/**
 * Conversation cluster interface
 */
interface ConversationCluster {
  id: string;
  userIds: string[];
  privacyRadius?: number;
}

/**
 * Map location node determines where users should be positioned using spatial intelligence
 */
export async function mapLocationNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users, spatialAnalysis } = state;
  const updatedUsers = new Map(users);

  // Group users by their currentRoom (activity-based rooms or voice channels)
  const roomGroups = new Map<string, UserState[]>();

  Array.from(updatedUsers.entries()).forEach(([_userId, user]) => {
    const roomId = user.inVoiceChannel && user.voiceChannelId
      ? `voice:${user.voiceChannelId}`
      : user.currentRoom || "unknown";
    if (!roomGroups.has(roomId)) {
      roomGroups.set(roomId, []);
    }
    roomGroups.get(roomId)!.push(user);
  });

  // Position users in each room
  for (const [roomId, roomUsers] of roomGroups.entries()) {
    if (roomId.startsWith("voice:")) {
      await positionUsersInVoiceChannelRoom(roomId.slice("voice:".length), roomUsers);
    } else if (spatialAnalysis.has(roomId)) {
      await positionUsersWithSpatialIntelligence(roomId, roomUsers, spatialAnalysis.get(roomId)!);
    } else if (ROOM_POSITIONS[roomId]) {
      // Activity-based room
      await positionUsersInActivityRoom(roomId, roomUsers);
    } else {
      // Voice channel or unknown room
      await positionUsersInVoiceChannelRoom(roomId, roomUsers);
    }
  }

  const roomSummary = Array.from(roomGroups.entries())
    .map(([room, users]) => `${room}: ${users.length}`)
    .join(", ");

  console.log(`[MapLocation] Positioned ${users.size} users across rooms: ${roomSummary}`);

  return {
    users: updatedUsers,
  };
}

/**
 * Position users using LLM-guided spatial intelligence
 */
async function positionUsersWithSpatialIntelligence(
  room: string,
  users: UserState[],
  spatialData: SpatialAnalysisData
): Promise<void> {
  const roomCenter = ROOM_POSITIONS[room];
  const bounds = ROOM_BOUNDS[room];
  const furniture = ROOM_FURNITURE[room] || [];

  if (!roomCenter || !bounds) {
    console.warn(`[MapLocation] Unknown room: ${room}`);
    return;
  }

  // Step 1: Create conversation clusters based on LLM analysis
  const clusters = createConversationClusters(users, spatialData);

  // Step 2: Assign positions to each cluster within the room
  const clusterPositions = assignClusterPositions(clusters, roomCenter, bounds);

  // Step 3: Position users within their clusters respecting social distances
  const userPositions: Map<string, Vector3D> = new Map();
  for (const cluster of clusters) {
    for (const userId of cluster.userIds) {
      const user = users.find(u => u.userId === userId);
      if (!user) continue;

      const clusterPos = clusterPositions.get(cluster.id);
      if (!clusterPos) continue;

      const position = calculateUserPosition(user, cluster, clusterPos, spatialData, cluster.userIds);
      userPositions.set(userId, position);
    }
  }

  // Step 4: Adjust positions for furniture proximity
  adjustForFurnitureProximity(userPositions, users, furniture);

  // Step 5: Resolve any remaining collisions
  resolveCollisions(userPositions, users);

  // Step 6: Update user state with final positions
  Array.from(userPositions.entries()).forEach(([userId, position]) => {
    const user = users.find(u => u.userId === userId);
    if (user) {
      updateUserPositionState(user, position);
    }
  });

  console.log(
    `[MapLocation] Positioned ${users.length} users in ${room} using spatial intelligence (${clusters.length} clusters)`
  );
}

function createConversationClusters(
  users: UserState[],
  spatialData: SpatialAnalysisData
): ConversationCluster[] {
  const clusters: ConversationCluster[] = [];
  const assignedUsers = new Set<string>();

  for (let i = 0; i < spatialData.conversation_groups.length; i++) {
    const group = spatialData.conversation_groups[i];
    const validUsers = group.filter(userId => users.some(u => u.userId === userId));

    if (validUsers.length > 0) {
      clusters.push({
        id: "cluster-" + i,
        userIds: validUsers,
      });
      validUsers.forEach(id => assignedUsers.add(id));
    }
  }

  for (let i = 0; i < spatialData.privacy_zones.length; i++) {
    const zone = spatialData.privacy_zones[i];
    const validUsers = zone.users.filter(userId => users.some(u => u.userId === userId));

    if (validUsers.length > 0 && !validUsers.every(id => assignedUsers.has(id))) {
      clusters.push({
        id: "privacy-" + i,
        userIds: validUsers,
        privacyRadius: zone.radius,
      });
      validUsers.forEach(id => assignedUsers.add(id));
    }
  }

  const remainingUsers = users.filter(u => !assignedUsers.has(u.userId));

  for (const activityType of Object.keys(spatialData.activity_clusters)) {
    const activityUsers = spatialData.activity_clusters[activityType];
    const validUsers = remainingUsers.filter(u => activityUsers.includes(u.userId));

    if (validUsers.length > 0) {
      clusters.push({
        id: "activity-" + activityType,
        userIds: validUsers.map(u => u.userId),
      });
      validUsers.forEach(u => assignedUsers.add(u.userId));
    }
  }

  const stillRemaining = remainingUsers.filter(u => !assignedUsers.has(u.userId));
  for (const user of stillRemaining) {
    clusters.push({
      id: "individual-" + user.userId,
      userIds: [user.userId],
    });
  }

  return clusters;
}

function assignClusterPositions(
  clusters: ConversationCluster[],
  roomCenter: Vector3D,
  bounds: { width: number; depth: number }
): Map<string, Vector3D> {
  const positions = new Map<string, Vector3D>();

  if (clusters.length === 1) {
    positions.set(clusters[0].id, { x: roomCenter.x, y: roomCenter.y, z: roomCenter.z });
    return positions;
  }

  const clusterRadius = Math.min(bounds.width, bounds.depth) / 4;

  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const angle = (2 * Math.PI * i) / clusters.length;

    const randomOffset = 0.5;
    const offsetX = (Math.random() - 0.5) * randomOffset;
    const offsetZ = (Math.random() - 0.5) * randomOffset;

    positions.set(cluster.id, {
      x: roomCenter.x + clusterRadius * Math.cos(angle) + offsetX,
      y: roomCenter.y,
      z: roomCenter.z + clusterRadius * Math.sin(angle) + offsetZ,
    });
  }

  return positions;
}

function calculateUserPosition(
  user: UserState,
  cluster: ConversationCluster,
  clusterPosition: Vector3D,
  spatialData: SpatialAnalysisData,
  clusterMembers: string[]
): Vector3D {
  const clusterSize = clusterMembers.length;

  if (clusterSize === 1) {
    return { x: clusterPosition.x, y: clusterPosition.y, z: clusterPosition.z };
  }

  const userIndex = clusterMembers.indexOf(user.userId);
  const privacyRadius = cluster.privacyRadius || 2.0;

  const radius = clusterSize > 2 ? privacyRadius * 0.6 : privacyRadius * 0.4;
  const angle = (2 * Math.PI * userIndex) / clusterSize;

  const socialDistance = getPreferredSocialDistance(user.userId, clusterMembers, spatialData);
  const adjustedRadius = Math.max(radius, socialDistance / 2);

  return {
    x: clusterPosition.x + adjustedRadius * Math.cos(angle),
    y: clusterPosition.y,
    z: clusterPosition.z + adjustedRadius * Math.sin(angle),
  };
}

function getPreferredSocialDistance(
  userId: string,
  clusterMembers: string[],
  spatialData: SpatialAnalysisData
): number {
  const distances = spatialData.social_distances[userId];
  if (!distances) return DEFAULT_SOCIAL_DISTANCE;

  let totalDistance = 0;
  let count = 0;

  for (const otherId of clusterMembers) {
    if (otherId === userId) continue;

    const distance = distances[otherId];
    if (distance) {
      totalDistance += Math.min(Math.max(distance, MIN_DISTANCE), MAX_DISTANCE);
      count++;
    }
  }

  return count > 0 ? totalDistance / count : DEFAULT_SOCIAL_DISTANCE;
}

function adjustForFurnitureProximity(
  userPositions: Map<string, Vector3D>,
  users: UserState[],
  furniture: Array<{ type: string; position: Vector3D; radius: number }>
): void {
  for (const user of users) {
    const position = userPositions.get(user.userId);
    if (!position) continue;

    const preferredFurniture = ACTIVITY_FURNITURE[user.activityType] || ACTIVITY_FURNITURE.unknown;

    let closestFurniture: typeof furniture[0] | null = null;
    let closestDistance = Infinity;

    for (const item of furniture) {
      if (preferredFurniture.includes(item.type)) {
        const distance = Math.sqrt(
          Math.pow(position.x - item.position.x, 2) +
          Math.pow(position.z - item.position.z, 2)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestFurniture = item;
        }
      }
    }

    if (closestFurniture && closestDistance > closestFurniture.radius + 0.5) {
      const direction = {
        x: closestFurniture.position.x - position.x,
        z: closestFurniture.position.z - position.z,
      };

      const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
      if (length > 0) {
        const adjustment = Math.min(closestDistance - closestFurniture.radius - 0.5, 1.0);
        userPositions.set(user.userId, {
          x: position.x + (direction.x / length) * adjustment,
          y: position.y,
          z: position.z + (direction.z / length) * adjustment,
        });
      }
    }
  }
}

function resolveCollisions(userPositions: Map<string, Vector3D>, users: UserState[]): void {
  const maxIterations = 10;
  const minDistance = 0.8;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let hasCollisions = false;

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const user1 = users[i];
        const user2 = users[j];
        const pos1 = userPositions.get(user1.userId);
        const pos2 = userPositions.get(user2.userId);

        if (!pos1 || !pos2) continue;

        const distance = Math.sqrt(
          Math.pow(pos1.x - pos2.x, 2) +
          Math.pow(pos1.z - pos2.z, 2)
        );

        if (distance < minDistance && distance > 0) {
          hasCollisions = true;

          const overlap = minDistance - distance;
          const direction = {
            x: (pos1.x - pos2.x) / distance,
            z: (pos1.z - pos2.z) / distance,
          };

          const moveAmount = overlap / 2;

          userPositions.set(user1.userId, {
            x: pos1.x + direction.x * moveAmount,
            y: pos1.y,
            z: pos1.z + direction.z * moveAmount,
          });

          userPositions.set(user2.userId, {
            x: pos2.x - direction.x * moveAmount,
            y: pos2.y,
            z: pos2.z - direction.z * moveAmount,
          });
        }
      }
    }

    if (!hasCollisions) break;
  }
}

function updateUserPositionState(user: UserState, targetPosition: Vector3D): void {
  user.targetPosition = targetPosition;

  const distance = Math.sqrt(
    Math.pow(targetPosition.x - user.position.x, 2) +
    Math.pow(targetPosition.z - user.position.z, 2)
  );

  // Preserve activity actions (gaming, listening, watching) - only update animation
  const activityActions = new Set(["gaming", "listening", "watching", "typing", "talking"]);
  if (distance > 0.5) {
    // Only override action if it's not an activity
    if (!activityActions.has(user.action)) {
      user.action = "walking";
    }
    user.animation = "walk";
  } else {
    user.position = { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z };
    // Keep activity action, update animation to idle
    if (user.action === "sleeping") user.animation = "sleep";
    else if (user.action === "talking" || user.action === "typing") user.animation = "talk";
    else if (user.action === "gaming" || user.action === "listening" || user.action === "watching") {
      user.animation = "gesture";
    } else user.animation = "idle";
  }

  console.log(
    "[MapLocation] " + user.username + " positioned in " + user.currentRoom + " at (" +
    targetPosition.x.toFixed(1) + ", " + targetPosition.z.toFixed(1) + ") action=" + user.action
  );
}

/**
 * Position users in activity-based rooms (game_room, living_room, etc.)
 */
async function positionUsersInActivityRoom(roomId: string, users: UserState[]): Promise<void> {
  const roomCenter = ROOM_POSITIONS[roomId];
  const roomBounds = ROOM_BOUNDS[roomId];

  if (!roomCenter || !roomBounds) {
    console.warn(`[MapLocation] Unknown room: ${roomId}, using default`);
    await positionUsersInCircleCustom(users, { x: 0, y: 0, z: 0 }, 10, 10, roomId);
    return;
  }

  // Position users in a circle within the room
  await positionUsersInCircleCustom(users, roomCenter, roomBounds.width, roomBounds.depth, roomId);
}

/**
 * Position users in voice channel rooms (far right side of map)
 * Voice channels are dynamically positioned at x: 30 with z-spacing
 */
async function positionUsersInVoiceChannelRoom(
  channelId: string,
  users: UserState[]
): Promise<void> {
  // Calculate position based on voice channel ID hash (for consistent positioning)
  // Voice channels are at x: 30, spaced by 12 units in z
  const voiceZoneStart = 30;
  const voiceChannelSpacing = 12;

  // Use the first user's voice channel name to get a stable index
  const channelName = users[0]?.voiceChannelName || channelId;
  // Simple hash of channel name to get an index
  const hashIndex = channelName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;

  const roomCenter = {
    x: voiceZoneStart,
    y: 0,
    z: (hashIndex * voiceChannelSpacing) - (5 * voiceChannelSpacing)
  };

  // Position users in a circle within the voice channel room
  await positionUsersInCircleCustom(users, roomCenter, 10, 10, `Voice: ${channelName}`);
}

/**
 * Custom circle positioning with configurable bounds
 */
async function positionUsersInCircleCustom(
  users: UserState[],
  center: { x: number; y: number; z: number },
  width: number,
  depth: number,
  roomName: string
): Promise<void> {
  const radius = Math.min(width, depth) / 3;
  const centerX = center.x;
  const centerZ = center.z;

  users.forEach((user, index) => {
    let position: Vector3D;

    if (users.length === 1) {
      position = {
        x: centerX,
        y: 0,
        z: centerZ,
      };
    } else {
      const angle = (2 * Math.PI * index) / users.length;
      position = {
        x: centerX + radius * Math.cos(angle),
        y: 0,
        z: centerZ + radius * Math.sin(angle),
      };
    }

    updateUserPositionState(user, position);
  });

  console.log(`[MapLocation] Positioned ${users.length} users in ${roomName} using circle layout`);
}
