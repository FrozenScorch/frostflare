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
