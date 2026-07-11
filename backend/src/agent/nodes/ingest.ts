/**
 * Ingest Node - Consumes raw Discord events and updates user state
 */

import type { StateAnnotation } from "../state.js";
import { getRelationshipTracker } from "../../services/relationship_tracker.js";

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
      case "message_update":
        await handleMessageUpdate(event, updatedUsers);
        break;
      case "message_delete":
        await handleMessageDelete(event, updatedUsers);
        break;
      case "message_delete_bulk":
        await handleMessageDeleteBulk(event, updatedUsers);
        break;
      case "member_update":
        await handleMemberUpdate(event, updatedUsers);
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
  const relationshipTracker = getRelationshipTracker();

  if (!users.has(userId)) {
    // Create new user
    users.set(userId, {
      username: data.username,
      displayName: data.displayName || data.username,
      avatar: data.avatar,
      userId: userId,
      guildId: data.guildId,
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

  // Track relationships from message
  // If message is a reply, track relationship with original author
  if (data.replyToUserId && data.replyToUserId !== userId) {
    relationshipTracker.updateFromMessage(userId, data.replyToUserId, new Date());
  }

  // Track relationships with mentioned users
  if (data.mentions && Array.isArray(data.mentions)) {
    for (const mention of data.mentions) {
      if (mention.id && mention.id !== userId) {
        relationshipTracker.updateFromMessage(userId, mention.id, new Date());
      }
    }
  }

  // For channel messages, increment relationships with all users active in the same channel
  // This simulates "being part of the conversation"
  if (data.channelId) {
    const timestamp = new Date();
    for (const [otherUserId, otherUser] of users.entries()) {
      if (otherUserId !== userId && otherUser.guildId === user.guildId) {
        // Check if the other user is active (recent activity)
        const timeSinceActivity = timestamp.getTime() - new Date(otherUser.lastActivity).getTime();
        if (timeSinceActivity < 300000) { // 5 minutes
          relationshipTracker.updateFromMessage(userId, otherUserId, timestamp);
        }
      }
    }
  }

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
  const relationshipTracker = getRelationshipTracker();

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.inVoiceChannel = data.inVoiceChannel;
    user.lastActivity = new Date();

    // Store voice channel metadata
    if (data.inVoiceChannel && data.channelId) {
      user.voiceChannelId = data.channelId;
      user.voiceChannelName = data.channelName || "Voice Channel";
      user.activityType = "voice_chat";
      user.action = "talking";
      // Don't set currentRoom here - let map_location node handle it
      user.mood = "happy";

      // Track voice relationships with other users in the same voice channel
      if (data.channelUsers && Array.isArray(data.channelUsers)) {
        relationshipTracker.updateFromVoiceState(userId, data.channelUsers, new Date());
      }

      console.log(`[Ingest] ${user.username} joined voice channel: ${user.voiceChannelName}`);
    } else {
      // User left voice channel
      user.voiceChannelId = null;
      user.voiceChannelName = null;
      user.activityType = "chatting";
      user.action = "idle";
      user.currentRoom = "entrance"; // Move to entrance when leaving voice
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

  // Create user if doesn't exist
  if (!users.has(userId)) {
    users.set(userId, {
      username: data.username || "Unknown",
      displayName: data.displayName || data.username || "Unknown",
      avatar: data.avatar || "",
      userId: userId,
      guildId: data.guildId,
      currentRoom: "living_room",
      position: { x: 0, y: 0, z: 0 },
      targetPosition: { x: 0, y: 0, z: 0 },
      action: "idle",
      animation: "idle",
      mood: "neutral",
      lastActivity: new Date(),
      activityType: "unknown",
      inVoiceChannel: false,
      isTyping: false,
      recentMessages: [],
    });
  }

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
  console.log(`[Ingest] ${user.username} activities:`, JSON.stringify(data.activities));
  if (data.activities && data.activities.length > 0) {
    // Skip Custom Status (type 4) and find real activities (gaming, listening, watching)
    const realActivity = data.activities.find((a: any) => a.type !== 4) || data.activities[0];
    console.log(`[Ingest] ${user.username} activity:`, JSON.stringify(realActivity));

    // Store rich presence details for LLM classification
    user.richPresence = realActivity.name || realActivity.details || realActivity.state || "";
    if (realActivity.type === 0) {
      // Playing a game (type 0 = Game)
      user.activityType = "gaming";
      user.action = "gaming";
      user.currentRoom = "game_room";
      user.mood = "excited";
    } else if (realActivity.type === 2) {
      // Listening to Spotify (type 2 = Listening)
      user.activityType = "listening_music";
      user.action = "listening";
      user.currentRoom = "music_room";
      user.mood = "happy";
    } else if (realActivity.type === 3) {
      // Watching video (type 3 = Watching)
      user.activityType = "watching_video";
      user.action = "watching";
      user.currentRoom = "media_room";
      user.mood = "focused";
    }
  } else {
    user.richPresence = "";
  }

  console.log(`[Ingest] ${user.username} presence update: ${data.status}`);
}

/**
 * Handle reaction add events
 */
async function handleReactionAdd(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;
  const relationshipTracker = getRelationshipTracker();

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.lastActivity = new Date();
    user.mood = "happy"; // Reacting usually shows engagement

    // Track relationship from reaction to message author
    if (data.messageAuthorId && data.messageAuthorId !== userId) {
      relationshipTracker.updateFromReaction(userId, data.messageAuthorId, new Date());
    }

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
    guildId: data.guildId,
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

/**
 * Handle message update (edit) events
 */
async function handleMessageUpdate(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  if (users.has(userId)) {
    const user = users.get(userId)!;
    user.lastActivity = new Date();
    user.editedMessageCount = (user.editedMessageCount || 0) + 1;
    user.recentMessages = user.recentMessages || [];

    // Show that user edited a message
    user.speechBubble = `edited: ${data.newContent.substring(0, 30)}...`;
    user.speechBubbleExpiry = new Date(Date.now() + 3000);

    console.log(`[Ingest] ${user.username} edited a message`);
  }
}

/**
 * Handle message delete events
 */
async function handleMessageDelete(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId } = event;

  if (userId !== "unknown" && users.has(userId)) {
    const user = users.get(userId)!;
    user.lastActivity = new Date();
    user.deletedMessageCount = (user.deletedMessageCount || 0) + 1;

    // Deletion could indicate moderation or self-deletion
    user.mood = "sad";
    user.speechBubble = "message deleted";
    user.speechBubbleExpiry = new Date(Date.now() + 3000);

    console.log(`[Ingest] Message from ${user.username} was deleted`);
  }
}

/**
 * Handle bulk message delete events
 */
async function handleMessageDeleteBulk(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { data } = event;

  // For bulk deletes, we don't know which specific users were affected
  // Log the event for tracking purposes
  console.log(`[Ingest] Bulk delete: ${data.count} messages in channel ${data.channelId}`);

  // Optionally update all users in the guild to reflect bulk activity
  for (const user of users.values()) {
    if (user.guildId === data.guildId) {
      user.lastActivity = new Date();
      user.bulkDeleteParticipations = (user.bulkDeleteParticipations || 0) + 1;
    }
  }
}

/**
 * Handle member update events (roles, nickname, timeout)
 */
async function handleMemberUpdate(
  event: any,
  users: Map<string, any>
): Promise<void> {
  const { userId, data } = event;

  if (!users.has(userId)) {
    // Create user if doesn't exist
    users.set(userId, {
      username: data.username,
      displayName: data.username,
      avatar: "",
      userId: userId,
      guildId: data.guildId,
      currentRoom: "living_room",
      position: { x: 0, y: 0, z: 0 },
      targetPosition: { x: 0, y: 0, z: 0 },
      action: "idle",
      animation: "idle",
      mood: "neutral",
      lastActivity: new Date(),
      activityType: "unknown",
      inVoiceChannel: false,
      isTyping: false,
    });
  }

  const user = users.get(userId)!;
  user.lastActivity = new Date();

  const changes = data.changes || {};

  // Handle nickname change
  if (changes.nickname) {
    user.nicknameHistory = user.nicknameHistory || [];
    user.nicknameHistory.push({
      nickname: changes.nickname.new || data.username,
      timestamp: new Date(),
    });
    user.displayName = changes.nickname.new || user.displayName;

    console.log(`[Ingest] ${user.username} nickname changed to ${changes.nickname.new}`);
  }

  // Handle role changes
  if (changes.roles) {
    user.previousRoles = user.roles || [];
    user.roles = changes.roles.added || [];
    user.roleChangeCount = (user.roleChangeCount || 0) + 1;

    // Role change is significant - show in speech bubble
    const added = changes.roles.added?.join(", ") || "";
    const removed = changes.roles.removed?.join(", ") || "";
    user.speechBubble = `Roles: +${added} -${removed}`;
    user.speechBubbleExpiry = new Date(Date.now() + 5000);

    console.log(`[Ingest] ${user.username} roles changed: +${added} -${removed}`);
  }

  // Handle timeout changes
  if (changes.timeout) {
    if (changes.timeout.new) {
      user.timeoutUntil = new Date(changes.timeout.new);
      user.timeoutCount = (user.timeoutCount || 0) + 1;
      user.mood = "sad";
      user.currentRoom = "entrance"; // Timed out users to entrance
      user.action = "idle";
      user.speechBubble = "timed out";
      user.speechBubbleExpiry = new Date(Date.now() + 5000);

      console.log(`[Ingest] ${user.username} was timed out until ${changes.timeout.new}`);
    } else {
      user.timeoutUntil = null;
      user.mood = "happy"; // Timeout removed
      user.speechBubble = "timeout removed";
      user.speechBubbleExpiry = new Date(Date.now() + 3000);

      console.log(`[Ingest] ${user.username} timeout was removed`);
    }
  }
}
