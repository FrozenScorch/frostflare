/**
 * Animation Node - Determines animations for users
 */

import type { StateAnnotation } from "../state.js";
import { getLlamaClient } from "../../llm/llama.js";

/**
 * Animation node determines what animations users should play
 */
export async function animationNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users } = state;
  const updatedUsers = new Map(users);
  const llama = getLlamaClient();

  for (const [_userId, user] of updatedUsers.entries()) {
    try {
      // Check if user is moving
      const isMoving = user.action === "walking";

      // Get animation based on state
      const animation = await llama.getAnimation(
        user.action,
        user.mood,
        user.activityType,
        isMoving
      );

      user.animation = animation as any;

      // Update speech bubble expiry
      if (user.speechBubbleExpiry) {
        if (new Date() > user.speechBubbleExpiry) {
          user.speechBubble = undefined;
          user.speechBubbleExpiry = undefined;
        }
      }

      // Clear typing status if no longer typing
      if (user.isTyping && user.activityType !== "typing") {
        user.isTyping = false;
      }

      console.log(
        `[Animation] ${user.username}: ${animation} (${user.action}, ${user.mood})`
      );
    } catch (error) {
      console.error(`[Animation] Error setting animation for ${user.username}:`, error);
    }
  }

  console.log(`[Animation] Updated animations for ${users.size} users`);

  return {
    users: updatedUsers,
  };
}
