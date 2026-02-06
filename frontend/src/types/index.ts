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
  currentRoom: RoomType;
  position: Vector3D;
  targetPosition: Vector3D;
  action: UserAction;
  animation: AnimationType;
  mood: Mood;
  lastActivity: string;
  speechBubble?: string;
  isTyping: boolean;
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
}

export interface Room {
  id: RoomType;
  name: string;
  color: number;
  position: Vector3D;
  size: Vector3D;
}

// Room definitions
export const ROOMS: Room[] = [
  {
    id: "entrance",
    name: "Entrance",
    color: 0x88cc88,
    position: { x: 0, y: 0, z: 0 },
    size: { x: 8, y: 3, z: 8 },
  },
  {
    id: "living_room",
    name: "Living Room",
    color: 0xcc8888,
    position: { x: 10, y: 0, z: 10 },
    size: { x: 12, y: 3, z: 12 },
  },
  {
    id: "game_room",
    name: "Game Room",
    color: 0x88cc44,
    position: { x: -10, y: 0, z: 10 },
    size: { x: 10, y: 3, z: 10 },
  },
  {
    id: "kitchen",
    name: "Kitchen",
    color: 0xcccc88,
    position: { x: 10, y: 0, z: -10 },
    size: { x: 8, y: 3, z: 8 },
  },
  {
    id: "library",
    name: "Library",
    color: 0x8888cc,
    position: { x: -10, y: 0, z: -10 },
    size: { x: 10, y: 3, z: 10 },
  },
  {
    id: "media_room",
    name: "Media Room",
    color: 0xcc88cc,
    position: { x: 20, y: 0, z: 0 },
    size: { x: 10, y: 3, z: 8 },
  },
  {
    id: "music_room",
    name: "Music Room",
    color: 0x88cccc,
    position: { x: -20, y: 0, z: 0 },
    size: { x: 8, y: 3, z: 8 },
  },
  {
    id: "garden",
    name: "Garden",
    color: 0x44cc44,
    position: { x: 0, y: 0, z: 20 },
    size: { x: 15, y: 3, z: 15 },
  },
  {
    id: "bedroom",
    name: "Bedroom",
    color: 0x888888,
    position: { x: 0, y: 0, z: -20 },
    size: { x: 10, y: 3, z: 10 },
  },
];
