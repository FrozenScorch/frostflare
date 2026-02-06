/**
 * Discord Event Handlers
 */

import {
  Client,
  GatewayIntentBits,
  Partials,
  Message,
  Presence,
  VoiceState,
} from "discord.js";

export interface DiscordEventData {
  type: string;
  userId: string;
  timestamp: Date;
  data: any;
}

export class DiscordEventCollector {
  private eventBuffer: DiscordEventData[] = [];
  private eventCallbacks: Array<(events: DiscordEventData[]) => void> = [];
  private maxBufferSize: number = 100;
  private flushInterval: number = 1000; // 1 second
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.startFlushTimer();
  }

  /**
   * Add event to buffer
   */
  addEvent(event: DiscordEventData) {
    this.eventBuffer.push(event);

    console.log(`[EventCollector] Added ${event.type} event from ${event.userId}`);

    // Flush if buffer is full
    if (this.eventBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  /**
   * Register callback for event batches
   */
  onEvents(callback: (events: DiscordEventData[]) => void) {
    this.eventCallbacks.push(callback);
  }

  /**
   * Flush events to callbacks
   */
  flush() {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    console.log(`[EventCollector] Flushing ${events.length} events`);

    for (const callback of this.eventCallbacks) {
      try {
        callback(events);
      } catch (error) {
        console.error("[EventCollector] Error in callback:", error);
      }
    }
  }

  /**
   * Start automatic flush timer
   */
  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop the event collector
   */
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

/**
 * Create Discord client with event handlers
 */
export function createDiscordClient(
  _token: string,
  eventCollector: DiscordEventCollector
): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
    ],
  });

  // Ready event
  client.once("ready", () => {
    console.log(`[Discord] Logged in as ${client.user?.tag}`);
  });

  // Message event
  client.on("messageCreate", (message: Message) => {
    if (message.author.bot) return;

    eventCollector.addEvent({
      type: "message",
      userId: message.author.id,
      timestamp: new Date(),
      data: {
        username: message.author.username,
        displayName: message.member?.displayName || message.author.username,
        avatar: message.author.displayAvatarURL(),
        content: message.content,
        channelId: message.channelId,
      },
    });
  });

  // Typing start event
  client.on("typingStart", (typing) => {
    if (!typing.user || typing.user.bot) return;

    eventCollector.addEvent({
      type: "typing_start",
      userId: typing.user.id,
      timestamp: new Date(),
      data: {
        username: typing.user.username,
        channelId: typing.channel.id,
      },
    });
  });

  // Voice state update
  client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
    if (newState.member?.user?.bot) return;

    const userId = newState.id;
    const inVoiceChannel = newState.channelId !== null;

    eventCollector.addEvent({
      type: "voice_state_update",
      userId: userId,
      timestamp: new Date(),
      data: {
        username: newState.member?.user.username || "Unknown",
        inVoiceChannel: inVoiceChannel,
        channelId: newState.channelId,
        channelIdOld: oldState.channelId,
      },
    });
  });

  // Presence update
  client.on("presenceUpdate", (_oldPresence: Presence | null, newPresence: Presence) => {
    if (!newPresence.userId || !newPresence.member) return;

    const userId = newPresence.userId;
    const user = newPresence.member.user;

    if (!user || user.bot) return;

    eventCollector.addEvent({
      type: "presence_update",
      userId: userId,
      timestamp: new Date(),
      data: {
        username: user.username,
        status: newPresence.status,
        activities: newPresence.activities || [],
        clientStatus: newPresence.clientStatus,
      },
    });
  });

  // Reaction add
  client.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guildId) return;

    eventCollector.addEvent({
      type: "reaction_add",
      userId: user.id,
      timestamp: new Date(),
      data: {
        username: user.username,
        emoji: reaction.emoji.name,
        messageId: reaction.message.id,
      },
    });
  });

  // Guild member add (user joined)
  client.on("guildMemberAdd", (member) => {
    if (member.user.bot) return;

    eventCollector.addEvent({
      type: "user_join",
      userId: member.id,
      timestamp: new Date(),
      data: {
        username: member.user.username,
        displayName: member.displayName,
        avatar: member.user.displayAvatarURL(),
      },
    });
  });

  // Guild member remove (user left)
  client.on("guildMemberRemove", (member) => {
    eventCollector.addEvent({
      type: "user_leave",
      userId: member.id,
      timestamp: new Date(),
      data: {
        username: member.user.username,
      },
    });
  });

  return client;
}
