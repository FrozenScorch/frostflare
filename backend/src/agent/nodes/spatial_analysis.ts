/**
 * Spatial Analysis Node - Uses LLM to analyze social relationships and suggest positioning
 */

import type { StateAnnotation } from "../state.js";
import { getLlamaClient } from "../../llm/llama.js";
import { getRelationshipTracker } from "../../services/relationship_tracker.js";

export async function spatialAnalysisNode(
  state: typeof StateAnnotation.State
): Promise<Partial<typeof StateAnnotation.State>> {
  const { users } = state;
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

  // Perform spatial analysis for each room
  const spatialAnalysis = new Map<string, any>();
  const llamaClient = getLlamaClient();

  for (const [room, roomUsers] of usersByRoom.entries()) {
    if (roomUsers.length < 2) {
      // Skip analysis for rooms with 0-1 users
      continue;
    }

    try {
      // Get relationship summary for users in this room
      const userIds = roomUsers.map((u) => u.userId);
      const relationshipSummary = relationshipTracker.getRelationshipSummary(userIds);

      const analysis = await llamaClient.analyzeSpatialLayout(
        roomUsers.map((u) => ({
          userId: u.userId,
          username: u.username,
          currentRoom: u.currentRoom,
          activity: u.activityType || "unknown",
          recentMessages: u.recentMessages || [],
          mood: u.mood || "neutral",
        })),
        room,
        relationshipSummary
      );

      spatialAnalysis.set(room, analysis);
      console.log(`[SpatialAnalysis] Analyzed ${roomUsers.length} users in ${room}`);
    } catch (error) {
      console.error(`[SpatialAnalysis] Error analyzing room ${room}:`, error);
    }
  }

  return {
    spatialAnalysis,
  };
}
