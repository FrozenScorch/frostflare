/**
 * Relationship Tracker Service
 *
 * Tracks social relationships between users based on their interactions over time.
 * Monitors messages, voice states, gaming sessions, and reactions to build
 * friendship scores that inform spatial positioning preferences.
 */

import type { RelationshipScore, RelationshipGraph } from "../agent/state.js";

// Configuration constants
const FRIENDSHIP_INCREMENT = 0.05; // How much friendship grows per interaction
const FRIENDSHIP_DECAY_RATE = 0.001; // How much friendship decays per day
const FRIENDSHIP_DECAY_INTERVAL = 86400000; // Decay check interval (24 hours in ms)
const MAX_FRIENDSHIP_LEVEL = 1.0;
const MIN_FRIENDSHIP_LEVEL = 0.0;

export class RelationshipTracker {
  private static instance: RelationshipTracker | null = null;
  private relationshipGraph: RelationshipGraph;
  private decayTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.relationshipGraph = {
      relationships: new Map(),
      lastUpdate: new Date(),
    };
    this.startDecayTimer();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): RelationshipTracker {
    if (!RelationshipTracker.instance) {
      RelationshipTracker.instance = new RelationshipTracker();
    }
    return RelationshipTracker.instance;
  }

  /**
   * Update relationship from a message event
   */
  updateFromMessage(
    senderId: string,
    recipientId: string,
    timestamp: Date
  ): void {
    if (senderId === recipientId) return; // Skip self-interaction

    this.updateRelationship(senderId, recipientId, timestamp, "message");
    this.updateRelationship(recipientId, senderId, timestamp, "message");

    console.log(
      `[RelationshipTracker] Message: ${senderId} -> ${recipientId}`
    );
  }

  /**
   * Update relationship from voice state
   * Users in the same voice channel build relationships
   */
  updateFromVoiceState(
    userId: string,
    channelUsers: string[],
    timestamp: Date
  ): void {
    for (const otherUserId of channelUsers) {
      if (otherUserId === userId) continue;

      this.updateRelationship(userId, otherUserId, timestamp, "voice");
      this.updateRelationship(otherUserId, userId, timestamp, "voice");
    }

    console.log(
      `[RelationshipTracker] Voice state updated for ${userId} with ${channelUsers.length - 1} others`
    );
  }

  /**
   * Update relationship from gaming session
   * Users gaming together build stronger relationships
   */
  updateFromGamingSession(userIds: string[], timestamp: Date): void {
    for (let i = 0; i < userIds.length; i++) {
      for (let j = i + 1; j < userIds.length; j++) {
        const userId1 = userIds[i];
        const userId2 = userIds[j];

        this.updateRelationship(userId1, userId2, timestamp, "gaming");
        this.updateRelationship(userId2, userId1, timestamp, "gaming");
      }
    }

    console.log(
      `[RelationshipTracker] Gaming session: ${userIds.join(", ")}`
    );
  }

  /**
   * Update relationship from reaction
   */
  updateFromReaction(
    reactorId: string,
    targetUserId: string,
    timestamp: Date
  ): void {
    if (reactorId === targetUserId) return;

    this.updateRelationship(reactorId, targetUserId, timestamp, "reaction");

    console.log(
      `[RelationshipTracker] Reaction: ${reactorId} -> ${targetUserId}`
    );
  }

  /**
   * Get relationship score between two users
   */
  getRelationship(
    userId1: string,
    userId2: string
  ): RelationshipScore | undefined {
    const userRelationships = this.relationshipGraph.relationships.get(userId1);
    if (!userRelationships) {
      return undefined;
    }
    return userRelationships.get(userId2);
  }

  /**
   * Get close friends for a user
   * Returns list of user IDs with friendship level above threshold
   */
  getCloseFriends(userId: string, threshold: number = 0.5): string[] {
    const userRelationships = this.relationshipGraph.relationships.get(userId);
    if (!userRelationships) {
      return [];
    }

    const closeFriends: string[] = [];
    for (const [targetUserId, score] of userRelationships.entries()) {
      if (score.friendshipLevel >= threshold) {
        closeFriends.push(targetUserId);
      }
    }

    // Sort by friendship level (descending)
    closeFriends.sort((a, b) => {
      const scoreA = userRelationships.get(a)?.friendshipLevel || 0;
      const scoreB = userRelationships.get(b)?.friendshipLevel || 0;
      return scoreB - scoreA;
    });

    return closeFriends;
  }

  /**
   * Get all relationships
   */
  getRelationshipGraph(): RelationshipGraph {
    return {
      relationships: new Map(this.relationshipGraph.relationships),
      lastUpdate: new Date(this.relationshipGraph.lastUpdate),
    };
  }

  /**
   * Get relationship summary for spatial analysis
   * Returns formatted string of relationship data
   */
  getRelationshipSummary(userIds: string[]): string {
    const summaries: string[] = [];

    for (let i = 0; i < userIds.length; i++) {
      for (let j = i + 1; j < userIds.length; j++) {
        const userId1 = userIds[i];
        const userId2 = userIds[j];
        const relationship = this.getRelationship(userId1, userId2);

        if (relationship && relationship.friendshipLevel > 0.1) {
          const level = relationship.friendshipLevel;
          let label = "strangers";
          if (level >= 0.7) label = "close friends";
          else if (level >= 0.5) label = "friends";
          else if (level >= 0.3) label = "casual";

          summaries.push(
            `${userId1} and ${userId2}: ${level.toFixed(2)} (${label})`
          );
        }
      }
    }

    if (summaries.length === 0) {
      return "No established relationships yet.";
    }

    return summaries.join("\n");
  }

  /**
   * Clear all relationships (useful for testing)
   */
  clearAll(): void {
    this.relationshipGraph = {
      relationships: new Map(),
      lastUpdate: new Date(),
    };
    console.log("[RelationshipTracker] All relationships cleared");
  }

  /**
   * Core method to update relationship score
   */
  private updateRelationship(
    fromUserId: string,
    toUserId: string,
    timestamp: Date,
    interactionType: "message" | "voice" | "gaming" | "reaction"
  ): void {
    // Get or create user's relationship map
    let userRelationships = this.relationshipGraph.relationships.get(fromUserId);
    if (!userRelationships) {
      userRelationships = new Map();
      this.relationshipGraph.relationships.set(fromUserId, userRelationships);
    }

    // Get or create relationship score
    let score = userRelationships.get(toUserId);
    if (!score) {
      score = {
        userId: toUserId,
        friendshipLevel: 0.0,
        interactionCount: 0,
        lastInteraction: timestamp,
        interactionTypes: new Set(),
      };
      userRelationships.set(toUserId, score);
    }

    // Update interaction count
    score.interactionCount++;

    // Update friendship level with increment
    // Gaming gives bigger boost, followed by voice, then message/reaction
    let increment = FRIENDSHIP_INCREMENT;
    if (interactionType === "gaming") {
      increment = FRIENDSHIP_INCREMENT * 2;
    } else if (interactionType === "voice") {
      increment = FRIENDSHIP_INCREMENT * 1.5;
    }

    score.friendshipLevel = Math.min(
      MAX_FRIENDSHIP_LEVEL,
      score.friendshipLevel + increment
    );

    // Update last interaction time
    score.lastInteraction = timestamp;

    // Add interaction type
    score.interactionTypes.add(interactionType);

    // Update graph timestamp
    this.relationshipGraph.lastUpdate = timestamp;
  }

  /**
   * Start periodic decay of friendship levels
   * Users who stop interacting gradually become less close
   */
  private startDecayTimer(): void {
    if (this.decayTimer) {
      clearInterval(this.decayTimer);
    }

    this.decayTimer = setInterval(() => {
      this.applyDecay();
    }, FRIENDSHIP_DECAY_INTERVAL);

    console.log("[RelationshipTracker] Decay timer started");
  }

  /**
   * Apply decay to all relationships
   */
  private applyDecay(): void {
    const now = new Date();
    let decayedCount = 0;

    for (const [userId, userRelationships] of this.relationshipGraph.relationships.entries()) {
      for (const [targetUserId, score] of userRelationships.entries()) {
        const daysSinceLastInteraction =
          (now.getTime() - score.lastInteraction.getTime()) /
          FRIENDSHIP_DECAY_INTERVAL;

        if (daysSinceLastInteraction >= 1) {
          // Calculate decay amount based on time passed
          const decayAmount = FRIENDSHIP_DECAY_RATE * daysSinceLastInteraction;
          score.friendshipLevel = Math.max(
            MIN_FRIENDSHIP_LEVEL,
            score.friendshipLevel - decayAmount
          );

          decayedCount++;

          // Remove relationship if it's decayed to zero
          if (score.friendshipLevel <= 0) {
            userRelationships.delete(targetUserId);
          }
        }
      }

      // Clean up empty relationship maps
      if (userRelationships.size === 0) {
        this.relationshipGraph.relationships.delete(userId);
      }
    }

    if (decayedCount > 0) {
      console.log(
        `[RelationshipTracker] Applied decay to ${decayedCount} relationships`
      );
    }

    this.relationshipGraph.lastUpdate = now;
  }

  /**
   * Stop the decay timer
   */
  destroy(): void {
    if (this.decayTimer) {
      clearInterval(this.decayTimer);
      this.decayTimer = null;
    }
    RelationshipTracker.instance = null;
  }
}

/**
 * Get the RelationshipTracker singleton instance
 */
export function getRelationshipTracker(): RelationshipTracker {
  return RelationshipTracker.getInstance();
}
