/**
 * Discord Bot Client
 */

import { createDiscordClient, DiscordEventCollector } from "./events.js";
import { processEvents } from "../agent/graph.js";
import { setWsBroadcast } from "../agent/nodes/broadcast.js";
import type { GuildInfo } from "../agent/state.js";

export class DiscordBot {
  private token: string;
  private client: ReturnType<typeof createDiscordClient>;
  private eventCollector: DiscordEventCollector;
  private isRunning: boolean = false;
  private wsBroadcast: ((data: any) => void) | null = null;

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
   * Initialize all guild members on startup
   * Fetches all members and creates synthetic presence events for them
   */
  private async initializeGuildMembers() {
    console.log("[Bot] Initializing guild members...");

    let totalMembers = 0;
    let totalGuilds = 0;

    // Iterate through all guilds
    for (const [guildId, guild] of this.client.guilds.cache) {
      totalGuilds++;
      console.log(`[Bot] Fetching members for guild: ${guild.name}`);

      try {
        // Fetch all guild members (handles large guilds with pagination)
        const members = await guild.members.fetch();

        console.log(`[Bot] Found ${members.size} members in ${guild.name}`);

        // Create synthetic presence events for each member
        for (const [memberId, member] of members) {
          // Skip bots
          if (member.user.bot) continue;

          totalMembers++;

          // Create synthetic presence event
          this.eventCollector.addEvent({
            type: "presence_update",
            userId: memberId,
            timestamp: new Date(),
            data: {
              guildId: guildId,
              username: member.user.username,
              displayName: member.displayName,
              avatar: member.user.displayAvatarURL(),
              status: member.presence?.status || "offline",
              activities: member.presence?.activities || [],
              clientStatus: member.presence?.clientStatus || {},
              // Add voice channel info if they're in one
              inVoiceChannel: member.voice.channelId !== null,
              voiceChannelId: member.voice.channelId,
            },
          });
        }
      } catch (error) {
        console.error(`[Bot] Error fetching members for guild ${guild.name}:`, error);
      }
    }

    console.log(`[Bot] Initialized ${totalMembers} members from ${totalGuilds} guilds`);
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

      // Broadcast guild list after bot is ready
      this.client.once("ready", async () => {
        // Initialize all guild members first
        await this.initializeGuildMembers();

        // Wait a bit for events to process
        setTimeout(() => {
          this.broadcastGuildList();
        }, 2000);
      });
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
    this.wsBroadcast = fn;
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

  /**
   * Collect guild information
   */
  getGuildList(): GuildInfo[] {
    const guilds: GuildInfo[] = [];

    this.client.guilds.cache.forEach((guild) => {
      guilds.push({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        memberCount: guild.memberCount,
      });
    });

    return guilds;
  }

  /**
   * Broadcast guild list to connected clients
   */
  broadcastGuildList() {
    if (!this.wsBroadcast) {
      console.log("[Bot] No WebSocket broadcast function registered");
      return;
    }

    const guilds = this.getGuildList();

    this.wsBroadcast({
      type: "guilds_list",
      guilds: guilds,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Bot] Broadcast guild list: ${guilds.length} guilds`);
  }
}
