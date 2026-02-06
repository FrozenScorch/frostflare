/**
 * State management for Discord Sims Visualizer LangGraph
 */

import { Annotation } from "@langchain/langgraph";

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface UserState {
  username: string;
  displayName: string;
  avatar: string;
  userId: string;
  currentRoom: RoomType;
  position: Vector3D;
  targetPosition: Vector3D;
  action: UserAction;
  animation: AnimationType;
  mood: Mood;
  lastActivity: Date;
  speechBubble?: string;
  speechBubbleExpiry?: Date;
  activityType: ActivityType;
  inVoiceChannel: boolean;
  isTyping: boolean;
  // Additional properties for internal tracking
  recentMessages?: string[];
  richPresence?: string;
  lastEvent?: DiscordEvent;
  lastClassificationTime?: number;
}

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

export type ActivityType =
  | "unknown"
  | "chatting"
  | "gaming"
  | "voice_chat"
  | "listening_music"
  | "watching_video"
  | "working"
  | "studying"
  | "eating"
  | "sleeping"
  | "afk"
  | "typing";

export interface DiscordEvent {
  id: string;
  type: EventType;
  userId: string;
  timestamp: Date;
  data: any;
}

export type EventType =
  | "message"
  | "typing_start"
  | "voice_state_update"
  | "presence_update"
  | "reaction_add"
  | "user_join"
  | "user_leave";

export interface SocialInteraction {
  id: string;
  userIds: string[];
  type: "conversation" | "gaming_together" | "watching_together";
  startTime: Date;
  room: RoomType;
}

export interface GraphState {
  users: Map<string, UserState>;
  events: DiscordEvent[];
  interactions: SocialInteraction[];
  timestamp: Date;
  processedCount: number;
}

// Create the state annotation for LangGraph
export const StateAnnotation = Annotation.Root({
  users: Annotation<Map<string, UserState>>({
    reducer: (left?: Map<string, UserState>, right?: Map<string, UserState>) => {
      return right || left || new Map();
    },
    default: () => new Map<string, UserState>(),
  }),
  events: Annotation<DiscordEvent[]>({
    reducer: (left?: DiscordEvent[], right?: DiscordEvent[]) => {
      return [...(left || []), ...(right || [])];
    },
    default: () => [],
  }),
  interactions: Annotation<SocialInteraction[]>({
    reducer: (left?: SocialInteraction[], right?: SocialInteraction[]) => {
      return [...(left || []), ...(right || [])];
    },
    default: () => [],
  }),
  timestamp: Annotation<Date>({
    reducer: (_left?: Date, right?: Date) => right || new Date(),
    default: () => new Date(),
  }),
  processedCount: Annotation<number>({
    reducer: (left?: number, right?: number) => (right ?? 0) + (left ?? 0),
    default: () => 0,
  }),
});
