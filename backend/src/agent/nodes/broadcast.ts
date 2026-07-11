/**
 * Broadcast Node - Sends state to frontend via WebSocket
 */

import type { StateAnnotation } from "../state.js";

// WebSocket broadcaster singleton
let wsBroadcast: ((data: any) => void) | null = null;

/**
 * Set the WebSocket broadcast function
 */
export function setWsBroadcast(fn: (data: any) => void) {
  wsBroadcast = fn;
}

/**
 * Broadcast node sends state updates to frontend
 */
export async function broadcastNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users, events, interactions, timestamp } = state;

  // Prepare state for frontend
  const frontendState = {
    type: "state_update",
    timestamp: timestamp.toISOString(),
    users: Array.from(users.entries()).map(([userId, user]) => ({
      id: userId,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      guildId: user.guildId,
      currentRoom: user.currentRoom,
      position: user.position,
      targetPosition: user.targetPosition,
      action: user.action,
      animation: user.animation,
      mood: user.mood,
      lastActivity: user.lastActivity.toISOString(),
      speechBubble: user.speechBubble,
      isTyping: user.isTyping,
      voiceChannelId: user.voiceChannelId,
      voiceChannelName: user.voiceChannelName,
    })),
    interactions: interactions.map((i) => ({
      id: i.id,
      userIds: i.userIds,
      type: i.type,
      startTime: i.startTime.toISOString(),
      room: i.room,
    })),
    stats: {
      totalUsers: users.size,
      activeUsers: Array.from(users.values()).filter(
        (u) => Date.now() - u.lastActivity.getTime() < 300000 // Active in last 5 min
      ).length,
      totalInteractions: interactions.length,
      processedEvents: events.length,
    },
  };

  // Broadcast to all connected clients
  if (wsBroadcast) {
    try {
      wsBroadcast(frontendState);
      console.log(
        `[Broadcast] Sent state update: ${users.size} users, ${interactions.length} interactions`
      );
    } catch (error) {
      console.error("[Broadcast] Error sending state:", error);
    }
  } else {
    console.log("[Broadcast] No WebSocket clients connected");
  }

  return {};
}
