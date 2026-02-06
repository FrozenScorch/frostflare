/**
 * Ingest Node - Consumes raw Discord events and updates user state
 */

import type { StateAnnotation } from "../state.js";

export interface IngestNodeInput {
  events: any[];
  users: Map<string, any>;
}

export interface IngestNodeOutput {
  users: Map<string, any>;
  processedCount: number;
}

/**
 * Ingest node processes raw Discord events and updates user states
 */
export async function ingestNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { events, users } = state;
  let processedCount = 0;

  // Create a new map to avoid mutation
  const updatedUsers = new Map(users);

  for (const event of events) {
    processedCount++;

    switch (event.type) {
      case "message":
        await handleMessage(event, updatedUsers);
        break;
      case "typing_start":
        await handleTypingStart(event, updatedUsers);
        break;
      case "voice_state_update":
        await handleVoiceStateUpdate(event, updatedUsers);
        break;
      case "presence_update":
        await handlePresenceUpdate(event, updatedUsers);
        break;
      case "reaction_add":
        await handleReactionAdd(event, updatedUsers);
        break;
      case "user_join":
        await handleUserJoin(event, updatedUsers);
        break;
      case "user_leave":
        await handleUserLeave(event, updatedUsers);
        break;
      default:
        console.log(`Unknown event type: ${event.type}`);
    }
  }

  console.log(`[Ingest] Processed ${processedCount} events`);

  return {
    users: updatedUsers,
    processedCount,
  };
}

/**
 * Handle message events
 */
async function handleMessage(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  if (!users.has(userId)) {
    // Create new user
    users.set(userId, {
      username: data.username,
      displayName: data.displayName || data.username,
      avatar: data.avatar,
      userId: userId,
      currentRoom: "living_room",
      position: { x: 0, y: 0, z: 0 },
      targetPosition: { x: 0, y: 0, z: 0 },
      action: "idle",
      animation: "idle",
      mood: "neutral",
      lastActivity: new Date(),
      activityType: "chatting",
      inVoiceChannel: false,
      isTyping: false,
      recentMessages: [],
    });
  }

  const user = users.get(userId)!;
  user.lastActivity = new Date();
  user.activityType = "chatting";
  user.action = "talking";
  user.recentMessages = user.recentMessages || [];
  user.recentMessages.push(data.content);

  // Keep only last 10 messages
  if (user.recentMessages.length > 10) {
    user.recentMessages = user.recentMessages.slice(-10);
  }

  // Add speech bubble
  user.speechBubble = data.content.substring(0, 50);
  user.speechBubbleExpiry = new Date(Date.now() + 5000); // 5 seconds

  console.log(`[Ingest] Message from ${user.username}: ${data.content.substring(0, 30)}...`);
}

/**
 * Handle typing start events
 */
async function handleTypingStart(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.isTyping = true;
    user.lastActivity = new Date();
    user.activityType = "typing";
    user.action = "typing";

    // Clear typing after 10 seconds
    setTimeout(() => {
      if (users.has(userId)) {
        const u = users.get(userId);
        if (u && u.isTyping) {
          u.isTyping = false;
        }
      }
    }, 10000);

    console.log(`[Ingest] ${user.username} is typing`);
  }
}

/**
 * Handle voice state updates
 */
async function handleVoiceStateUpdate(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.inVoiceChannel = data.inVoiceChannel;
    user.lastActivity = new Date();

    if (data.inVoiceChannel) {
      user.activityType = "voice_chat";
      user.action = "talking";
      user.currentRoom = "living_room"; // Voice chat happens in living room
      user.mood = "happy";
      console.log(`[Ingest] ${user.username} joined voice chat`);
    } else {
      user.activityType = "chatting";
      user.action = "idle";
      console.log(`[Ingest] ${user.username} left voice chat`);
    }
  }
}

/**
 * Handle presence updates
 */
async function handlePresenceUpdate(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.lastActivity = new Date();

    // Update status based on presence
    if (data.status === "online") {
      user.mood = "neutral";
    } else if (data.status === "idle" || data.status === "dnd") {
      user.activityType = "afk";
      user.action = "idle";
      user.mood = "bored";
    } else if (data.status === "offline") {
      user.activityType = "sleeping";
      user.action = "sleeping";
      user.currentRoom = "bedroom";
    }

    // Update rich presence if available
    if (data.activities && data.activities.length > 0) {
      const activity = data.activities[0];
      if (activity.type === 0) {
        // Playing a game
        user.activityType = "gaming";
        user.action = "gaming";
        user.currentRoom = "game_room";
        user.mood = "excited";
      } else if (activity.type === 2) {
        // Listening to music
        user.activityType = "listening_music";
        user.action = "listening";
        user.currentRoom = "music_room";
        user.mood = "happy";
      } else if (activity.type === 3) {
        // Watching video
        user.activityType = "watching_video";
        user.action = "watching";
        user.currentRoom = "media_room";
        user.mood = "focused";
      }
    }

    console.log(`[Ingest] ${user.username} presence update: ${data.status}`);
  }
}

/**
 * Handle reaction add events
 */
async function handleReactionAdd(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.lastActivity = new Date();
    user.mood = "happy"; // Reacting usually shows engagement
    console.log(`[Ingest] ${user.username} added a reaction`);
  }
}

/**
 * Handle user join events
 */
async function handleUserJoin(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  users.set(userId, {
    username: data.username,
    displayName: data.displayName || data.username,
    avatar: data.avatar,
    userId: userId,
    currentRoom: "entrance",
    position: { x: 0, y: 0, z: 0 },
    targetPosition: { x: 0, y: 0, z: 0 },
    action: "walking",
    animation: "walk",
    mood: "neutral",
    lastActivity: new Date(),
    activityType: "unknown",
    inVoiceChannel: false,
    isTyping: false,
    speechBubble: "Just joined!",
    speechBubbleExpiry: new Date(Date.now() + 5000),
    recentMessages: [],
  });

  console.log(`[Ingest] ${data.username} joined the server`);
}

/**
 * Handle user leave events
 */
async function handleUserLeave(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.currentRoom = "entrance";
    user.activityType = "unknown";
    user.action = "walking";
    user.speechBubble = "Goodbye!";
    user.speechBubbleExpiry = new Date(Date.now() + 3000);

    console.log(`[Ingest] ${user.username} left the server`);
  }
}
