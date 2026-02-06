/**
 * Discord Bot Client
 */

import { createDiscordClient, DiscordEventCollector } from "./events.js";
import { processEvents } from "../agent/graph.js";
import { setWsBroadcast } from "../agent/nodes/broadcast.js";

export class DiscordBot {
  private token: string;
  private client: ReturnType<typeof createDiscordClient>;
  private eventCollector: DiscordEventCollector;
  private isRunning: boolean = false;

  constructor(token: string) {
    this.token = token;
    this.eventCollector = new DiscordEventCollector();
    this.client = createDiscordClient(token, this.eventCollector);

    // Set up event processing
    this.eventCollector.onEvents((events) => {
      this.processDiscordEvents(events);
    });
  }

  /**
   * Start the bot
   */
  async start() {
    if (this.isRunning) {
      console.log("[Bot] Already running");
      return;
    }

    try {
      await this.client.login(this.token);
      this.isRunning = true;
      console.log("[Bot] Started successfully");
    } catch (error) {
      console.error("[Bot] Failed to start:", error);
      throw error;
    }
  }

  /**
   * Stop the bot
   */
  async stop() {
    if (!this.isRunning) {
      console.log("[Bot] Not running");
      return;
    }

    this.eventCollector.stop();
    await this.client.destroy();
    this.isRunning = false;
    console.log("[Bot] Stopped");
  }

  /**
   * Process Discord events through the LangGraph
   */
  private async processDiscordEvents(events: any[]) {
    if (events.length === 0) return;

    try {
      console.log(`[Bot] Processing ${events.length} events through LangGraph`);

      const result = await processEvents(events);

      console.log(
        `[Bot] Processed ${result.processedCount} events, ${result.users.size} users, ${result.interactions.length} interactions`
      );

      // State is automatically broadcast via the broadcast node
    } catch (error) {
      console.error("[Bot] Error processing events:", error);
    }
  }

  /**
   * Set WebSocket broadcast function
   */
  setWebSocketBroadcast(fn: (data: any) => void) {
    setWsBroadcast(fn);
    console.log("[Bot] WebSocket broadcast registered");
  }

  /**
   * Get bot statistics
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      guilds: this.client.guilds.cache.size,
      users: this.client.users.cache.size,
    };
  }
}
