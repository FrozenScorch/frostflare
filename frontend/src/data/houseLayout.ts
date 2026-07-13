import type { Room, UserState } from "../types";

export const ROOM_SIZE = 10;
export const VOICE_WING_X = 20;
export const HOUSE_MIN_Z = -15;
export const HOUSE_MAX_Z = 15;

// A single, contiguous 3x3 ground floor. The entrance sits on the front edge.
export const HOUSE_ROOMS: Room[] = [
  { id: "game_room", name: "Game Room", color: 0x7653d6, position: { x: -10, y: 0, z: -10 }, size: { x: 10, y: 3, z: 10 } },
  { id: "living_room", name: "Living Room", color: 0xd58b63, position: { x: 0, y: 0, z: -10 }, size: { x: 10, y: 3, z: 10 } },
  { id: "media_room", name: "Media Room", color: 0x4f6fc9, position: { x: 10, y: 0, z: -10 }, size: { x: 10, y: 3, z: 10 } },
  { id: "library", name: "Library", color: 0xb98b55, position: { x: -10, y: 0, z: 0 }, size: { x: 10, y: 3, z: 10 } },
  { id: "kitchen", name: "Kitchen", color: 0xc9c4a8, position: { x: 0, y: 0, z: 0 }, size: { x: 10, y: 3, z: 10 } },
  { id: "music_room", name: "Music Room", color: 0xc85f5a, position: { x: 10, y: 0, z: 0 }, size: { x: 10, y: 3, z: 10 } },
  { id: "garden", name: "Garden Patio", color: 0x5d9b63, position: { x: -10, y: 0, z: 10 }, size: { x: 10, y: 3, z: 10 } },
  { id: "entrance", name: "Entrance", color: 0x6f9b86, position: { x: 0, y: 0, z: 10 }, size: { x: 10, y: 3, z: 10 } },
  { id: "bedroom", name: "Bedroom", color: 0xa67caf, position: { x: 10, y: 0, z: 10 }, size: { x: 10, y: 3, z: 10 } },
];

export function normalizeVoiceChannelId(channelId: string): string {
  return channelId.replace(/^voice:/, "");
}

export function getVoiceRoomId(channelId: string): string {
  return `voice:${normalizeVoiceChannelId(channelId)}`;
}

export function getVoiceRoomPosition(index: number, total: number) {
  return {
    x: VOICE_WING_X,
    y: 0,
    z: (index - (total - 1) / 2) * ROOM_SIZE,
  };
}

export function userBelongsInRoom(user: UserState, roomId: string): boolean {
  if (user.voiceChannelId) {
    return getVoiceRoomId(user.voiceChannelId) === roomId;
  }
  return user.currentRoom === roomId;
}

export function getEastExteriorWallSegments(voiceRooms: Room[]) {
  if (voiceRooms.length === 0) {
    return [{ centerZ: 0, length: HOUSE_MAX_Z - HOUSE_MIN_Z }];
  }

  const openingMin = Math.max(
    HOUSE_MIN_Z,
    Math.min(...voiceRooms.map((room) => room.position.z - room.size.z / 2)),
  );
  const openingMax = Math.min(
    HOUSE_MAX_Z,
    Math.max(...voiceRooms.map((room) => room.position.z + room.size.z / 2)),
  );
  const segments: Array<{ centerZ: number; length: number }> = [];

  if (openingMin > HOUSE_MIN_Z) {
    segments.push({
      centerZ: (HOUSE_MIN_Z + openingMin) / 2,
      length: openingMin - HOUSE_MIN_Z,
    });
  }
  if (openingMax < HOUSE_MAX_Z) {
    segments.push({
      centerZ: (openingMax + HOUSE_MAX_Z) / 2,
      length: HOUSE_MAX_Z - openingMax,
    });
  }

  return segments;
}

export function buildRooms(users: UserState[]): Room[] {
  const voiceChannels = new Map<string, UserState[]>();

  users.forEach((user) => {
    if (!user.voiceChannelId || !user.voiceChannelName) return;
    const channelId = normalizeVoiceChannelId(user.voiceChannelId);
    const members = voiceChannels.get(channelId) ?? [];
    members.push(user);
    voiceChannels.set(channelId, members);
  });

  const entries = Array.from(voiceChannels.entries()).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  const voiceRooms: Room[] = entries.map(([channelId, members], index) => ({
    id: getVoiceRoomId(channelId),
    name: members[0]?.voiceChannelName || `Voice Channel ${index + 1}`,
    color: 0x638ba8,
    position: getVoiceRoomPosition(index, entries.length),
    size: { x: ROOM_SIZE, y: 3, z: ROOM_SIZE },
    isVoiceChannel: true,
  }));

  return [...HOUSE_ROOMS, ...voiceRooms];
}
