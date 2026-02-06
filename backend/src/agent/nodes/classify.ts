/**
 * Classify Node - Uses LLM to classify user activities
 */

import type { StateAnnotation } from "../state.js";
import { getLlamaClient } from "../../llm/llama.js";

/**
 * Classify node uses LLM to enhance user state classification
 */
export async function classifyNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users } = state;
  const llama = getLlamaClient();

  // Check if Llama is available
  const llamaAvailable = await llama.healthCheck();
  if (!llamaAvailable) {
    console.log("[Classify] Llama.cpp not available, skipping LLM classification");
    return { users };
  }

  const updatedUsers = new Map(users);
  let classifiedCount = 0;

  // Classify each user's activity
  for (const [_userId, user] of updatedUsers.entries()) {
    // Skip if recently classified (within last 30 seconds)
    const lastClassification = user.lastClassificationTime || 0;
    const now = Date.now();
    if (now - lastClassification < 30000) {
      continue;
    }

    try {
      // Get user's recent messages
      const recentMessages = (user.recentMessages || []).slice(0, 3);
      const lastMessage = recentMessages[recentMessages.length - 1] || "";

      // Get rich presence info
      const richPresence = user.richPresence || "";

      const classification = await llama.classifyActivity(
        user.lastEvent?.type || "presence_update",
        user.activityType,
        richPresence,
        user.inVoiceChannel,
        user.isTyping,
        lastMessage
      );

      // Update user with classification
      user.activityType = classification.activityType as any;
      user.currentRoom = classification.room as any;
      user.action = classification.action as any;
      user.mood = classification.mood as any;
      user.lastClassificationTime = now;

      classifiedCount++;

      console.log(
        `[Classify] ${user.username}: ${classification.activityType} -> ${classification.room} (${classification.mood})`
      );
    } catch (error) {
      console.error(`[Classify] Error classifying ${user.username}:`, error);
    }
  }

  console.log(`[Classify] Classified ${classifiedCount} users`);

  return {
    users: updatedUsers,
  };
}
