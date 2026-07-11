/**
 * Interactions Node - Detects social interactions between users
 */

import type { StateAnnotation, SocialInteraction } from "../state.js";
import { getLlamaClient } from "../../llm/llama.js";
import { getRelationshipTracker } from "../../services/relationship_tracker.js";

/**
 * Interactions node detects social interactions between users
 */
export async function interactionsNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users, interactions } = state;
  const llama = getLlamaClient();

  // Check if Llama is available
  const llamaAvailable = await llama.healthCheck();
  if (!llamaAvailable) {
    console.log("[Interactions] Llama.cpp not available, using rule-based detection");
    return ruleBasedInteractionDetection(users, interactions);
  }

  // Prepare user data for LLM
  const userData = Array.from(users.values()).map((user) => ({
    userId: user.userId,
    username: user.username,
    currentRoom: user.currentRoom,
    recentMessages: user.recentMessages || [],
    activity: user.activityType,
  }));

  try {
    const detectedInteractions = await llama.detectInteractions(userData);

    // Filter out old interactions and add new ones
    const now = new Date();
    const activeInteractions = interactions.filter(
      (i) => now.getTime() - i.startTime.getTime() < 300000 // 5 minutes
    );

    for (const detected of detectedInteractions) {
      // Check if similar interaction already exists
      const exists = activeInteractions.some(
        (i) =>
          i.userIds.length === detected.userIds.length &&
          i.userIds.every((uid) => detected.userIds.includes(uid)) &&
          i.type === detected.type
      );

      if (!exists && detected.confidence > 0.6) {
        const interaction: SocialInteraction = {
          id: `${detected.userIds.sort().join("-")}-${Date.now()}`,
          userIds: detected.userIds,
          type: detected.type as any,
          startTime: new Date(),
          room: users.get(detected.userIds[0])?.currentRoom || "living_room",
        };

        activeInteractions.push(interaction);

        const usernames = detected.userIds
          .map((uid) => users.get(uid)?.username || uid)
          .join(" and ");
        console.log(
          `[Interactions] Detected: ${usernames} are ${detected.type} (confidence: ${detected.confidence})`
        );
      }
    }

    console.log(`[Interactions] Found ${activeInteractions.length} active interactions`);

    return {
      interactions: activeInteractions,
    };
  } catch (error) {
    console.error("[Interactions] Error detecting interactions:", error);
    return ruleBasedInteractionDetection(users, interactions);
  }
}

/**
 * Rule-based interaction detection (fallback)
 */
function ruleBasedInteractionDetection(
  users: Map<string, any>,
  _interactions: SocialInteraction[]
): Partial<typeof StateAnnotation.State> {
  const activeInteractions: SocialInteraction[] = [];
  const relationshipTracker = getRelationshipTracker();

  // Group users by room
  const usersByRoom = new Map<string, any[]>();
  for (const [_userId, user] of users.entries()) {
    const room = user.currentRoom;
    if (!usersByRoom.has(room)) {
      usersByRoom.set(room, []);
    }
    usersByRoom.get(room)!.push(user);
  }

  // Check for interactions in each room
  for (const [room, roomUsers] of usersByRoom.entries()) {
    if (roomUsers.length < 2) continue;

    // Check for users chatting together
    const chattingUsers = roomUsers.filter((u) => u.activityType === "chatting");
    if (chattingUsers.length >= 2) {
      const interaction: SocialInteraction = {
        id: `chat-${room}-${Date.now()}`,
        userIds: chattingUsers.slice(0, 4).map((u) => u.userId), // Max 4 people
        type: "conversation",
        startTime: new Date(),
        room: room as any,
      };
      activeInteractions.push(interaction);

      const usernames = chattingUsers.map((u) => u.username).join(", ");
      console.log(`[Interactions] ${usernames} are conversing in ${room}`);
    }

    // Check for users gaming together
    const gamingUsers = roomUsers.filter((u) => u.activityType === "gaming");
    if (gamingUsers.length >= 2) {
      const interaction: SocialInteraction = {
        id: `gaming-${room}-${Date.now()}`,
        userIds: gamingUsers.map((u) => u.userId),
        type: "gaming_together",
        startTime: new Date(),
        room: room as any,
      };
      activeInteractions.push(interaction);

      // Track gaming relationships
      const gamingUserIds = gamingUsers.map((u) => u.userId);
      relationshipTracker.updateFromGamingSession(gamingUserIds, new Date());

      const usernames = gamingUsers.map((u) => u.username).join(", ");
      console.log(`[Interactions] ${usernames} are gaming together`);
    }
  }

  console.log(`[Interactions] Found ${activeInteractions.length} rule-based interactions`);

  return {
    interactions: activeInteractions,
  };
}
