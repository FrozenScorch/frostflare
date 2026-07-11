/**
 * Frontend Type Definitions
 */

export type RoomType =
  | "living_room"
  | "game_room"
  | "kitchen"
  | "library"
  | "media_room"
  | "music_room"
  | "garden"
  | "bedroom"
  | "entrance";

export type UserAction =
  | "idle"
  | "walking"
  | "talking"
  | "gaming"
  | "eating"
  | "reading"
  | "watching"
  | "listening"
  | "sleeping"
  | "typing";

export type AnimationType =
  | "idle"
  | "walk"
  | "talk"
  | "gesture"
  | "sleep"
  | "dance";

export type Mood = "happy" | "neutral" | "sad" | "excited" | "focused" | "bored";

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface UserState {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  guildId: string;
  currentRoom: RoomType | string; // Allow dynamic room IDs for voice channels
  position: Vector3D;
  targetPosition: Vector3D;
  action: UserAction;
  animation: AnimationType;
  mood: Mood;
  lastActivity: string;
  speechBubble?: string;
  isTyping: boolean;
  voiceChannelId?: string | null;
  voiceChannelName?: string | null;
}

export interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
}

export interface SocialInteraction {
  id: string;
  userIds: string[];
  type: "conversation" | "gaming_together" | "watching_together";
  startTime: string;
  room: RoomType;
}

export interface ServerStats {
  totalUsers: number;
  activeUsers: number;
  totalInteractions: number;
  processedEvents: number;
}

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  users?: UserState[];
  interactions?: SocialInteraction[];
  stats?: ServerStats;
  message?: string;
  guilds?: GuildInfo[];
}

export interface Room {
  id: RoomType | string; // Allow dynamic room IDs for voice channels
  name: string;
  color: number;
  position: Vector3D;
  size: Vector3D;
  isVoiceChannel?: boolean; // Flag for voice channel rooms
}

// Room definitions - organized as a logical house floor plan
// Position is room center, so: room spans from (pos - size/2) to (pos + size/2)
//
// Simple compact 3x3 grid layout (like a real house):
//
//     TOP ROW (z=11):    Game Room | Living Room | Media Room
//     MID ROW (z=0):     Music Room |  Entrance  | Garden
//     BOT ROW (z=-11):   Library    |  Kitchen   | Bedroom
//
export const ROOMS: Room[] = [
  // CENTER ROW, CENTER: Entrance (10x10) at x=0, z=0 → spans x:[-5,5], z:[-5,5]
  {
    id: "entrance",
    name: "Entrance",
    color: 0x88cc88,
    position: { x: 0, y: 0, z: 0 },
    size: { x: 10, y: 3, z: 10 },
  },

  // CENTER ROW, LEFT: Music Room (10x10) - at x=-10.5, z=0 → spans x:[-15.5,-5.5], z:[-5,5]
  // Borders Entrance at x=-5.5
  {
    id: "music_room",
    name: "Music Room",
    color: 0x88cccc,
    position: { x: -10.5, y: 0, z: 0 },
    size: { x: 10, y: 3, z: 10 },
  },

  // CENTER ROW, RIGHT: Garden (10x10) - at x=10.5, z=0 → spans x:[5.5,15.5], z:[-5,5]
  // Borders Entrance at x=5.5
  {
    id: "garden",
    name: "Garden",
    color: 0x44cc44,
    position: { x: 10.5, y: 0, z: 0 },
    size: { x: 10, y: 3, z: 10 },
  },

  // TOP ROW, CENTER: Living Room (10x10) - at x=0, z=11 → spans x:[-5,5], z:[6,16]
  // Borders Entrance at z=5
  {
    id: "living_room",
    name: "Living Room",
    color: 0xcc8888,
    position: { x: 0, y: 0, z: 11 },
    size: { x: 10, y: 3, z: 10 },
  },

  // TOP ROW, LEFT: Game Room (10x10) - at x=-10.5, z=11 → spans x:[-15.5,-5.5], z:[6,16]
  // Borders Music Room and Living Room
  {
    id: "game_room",
    name: "Game Room",
    color: 0xff8844,  // Orange to distinguish from Garden green
    position: { x: -10.5, y: 0, z: 11 },
    size: { x: 10, y: 3, z: 10 },
  },

  // TOP ROW, RIGHT: Media Room (10x10) - at x=10.5, z=11 → spans x:[5.5,15.5], z:[6,16]
  // Borders Garden and Living Room
  {
    id: "media_room",
    name: "Media Room",
    color: 0xcc88cc,
    position: { x: 10.5, y: 0, z: 11 },
    size: { x: 10, y: 3, z: 10 },
  },

  // BOTTOM ROW, CENTER: Kitchen (10x10) - at x=0, z=-11 → spans x:[-5,5], z:[-16,-6]
  // Borders Entrance at z=-5
  {
    id: "kitchen",
    name: "Kitchen",
    color: 0xcccc88,
    position: { x: 0, y: 0, z: -11 },
    size: { x: 10, y: 3, z: 10 },
  },

  // BOTTOM ROW, LEFT: Library (10x10) - at x=-10.5, z=-11 → spans x:[-15.5,-5.5], z:[-16,-6]
  // Borders Music Room and Kitchen
  {
    id: "library",
    name: "Library",
    color: 0x8888cc,
    position: { x: -10.5, y: 0, z: -11 },
    size: { x: 10, y: 3, z: 10 },
  },

  // BOTTOM ROW, RIGHT: Bedroom (10x10) - at x=10.5, z=-11 → spans x:[5.5,15.5], z:[-16,-6]
  // Borders Garden and Kitchen
  {
    id: "bedroom",
    name: "Bedroom",
    color: 0x888888,
    position: { x: 10.5, y: 0, z: -11 },
    size: { x: 10, y: 3, z: 10 },
  },
];
