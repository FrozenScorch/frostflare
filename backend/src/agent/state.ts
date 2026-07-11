/**
 * State management for Frostflare LangGraph
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
  guildId: string;
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
  // Voice channel tracking
  voiceChannelId?: string | null;
  voiceChannelName?: string | null;
  // Additional properties for internal tracking
  recentMessages?: string[];
  richPresence?: string;
  lastEvent?: DiscordEvent;
  lastClassificationTime?: number;
  // Message activity tracking
  editedMessageCount?: number;
  deletedMessageCount?: number;
  bulkDeleteParticipations?: number;
  // Role and member tracking
  roles?: string[];
  previousRoles?: string[];
  roleChangeCount?: number;
  nicknameHistory?: Array<{ nickname: string; timestamp: Date }>;
  // Timeout tracking
  timeoutUntil?: Date | null;
  timeoutCount?: number;
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

export interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
}

export type EventType =
  | "message"
  | "typing_start"
  | "voice_state_update"
  | "presence_update"
  | "reaction_add"
  | "user_join"
  | "user_leave"
  | "message_update"
  | "message_delete"
  | "message_delete_bulk"
  | "member_update";

export interface SocialInteraction {
  id: string;
  userIds: string[];
  type: "conversation" | "gaming_together" | "watching_together";
  startTime: Date;
  room: RoomType;
}

export interface SpatialAnalysisData {
  conversation_groups: string[][];
  social_distances: Record<string, Record<string, number>>;
  activity_clusters: Record<string, string[]>;
  privacy_zones: Array<{ users: string[]; radius: number }>;
}

export interface RelationshipScore {
  userId: string;
  friendshipLevel: number; // 0-1, higher = closer friends
  interactionCount: number;
  lastInteraction: Date;
  interactionTypes: Set<"message" | "voice" | "gaming" | "reaction">;
}

export interface RelationshipGraph {
  relationships: Map<string, Map<string, RelationshipScore>>; // userId -> (targetUserId -> score)
  lastUpdate: Date;
}

export interface GraphState {
  users: Map<string, UserState>;
  events: DiscordEvent[];
  interactions: SocialInteraction[];
  timestamp: Date;
  processedCount: number;
  spatialAnalysis: Map<string, SpatialAnalysisData>;
  relationshipGraph: RelationshipGraph;
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
  }),
  spatialAnalysis: Annotation<Map<string, SpatialAnalysisData>>({
    reducer: (left?: Map<string, SpatialAnalysisData>, right?: Map<string, SpatialAnalysisData>) => {
      return right || left || new Map();
    },
    default: () => new Map<string, SpatialAnalysisData>(),
  }),
  relationshipGraph: Annotation<RelationshipGraph>({
    reducer: (left?: RelationshipGraph, right?: RelationshipGraph) => {
      return right || left || { relationships: new Map(), lastUpdate: new Date() };
    },
    default: () => ({ relationships: new Map(), lastUpdate: new Date() }),
  }),
});
