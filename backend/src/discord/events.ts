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
      GatewayIntentBits.GuildMembers, // Enable member updates
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
      Partials.GuildMember, // Enable partial member data
    ],
  });

  // Ready event
  client.once("ready", () => {
    console.log(`[Discord] Logged in as ${client.user?.tag}`);
  });

  // Message event
  client.on("messageCreate", (message: Message) => {
    if (message.author.bot) return;
    if (!message.guildId) return;

    eventCollector.addEvent({
      type: "message",
      userId: message.author.id,
      timestamp: new Date(),
      data: {
        guildId: message.guildId,
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
    // Only process guild channel typing (not DMs)
    if (!typing.channel || "guildId" in typing.channel === false) return;

    const guildId = (typing.channel as any).guildId;
    if (!guildId) return;

    eventCollector.addEvent({
      type: "typing_start",
      userId: typing.user.id,
      timestamp: new Date(),
      data: {
        guildId: guildId,
        username: typing.user.username,
        channelId: typing.channel.id,
      },
    });
  });

  // Voice state update
  client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
    if (newState.member?.user?.bot) return;
    if (!newState.guild) return;

    const userId = newState.id;
    const inVoiceChannel = newState.channelId !== null;

    // Get voice channel names
    const newChannel = newState.channel ? newState.channel.name : null;
    const oldChannel = oldState.channel ? oldState.channel.name : null;

    eventCollector.addEvent({
      type: "voice_state_update",
      userId: userId,
      timestamp: new Date(),
      data: {
        guildId: newState.guild.id,
        username: newState.member?.user.username || "Unknown",
        inVoiceChannel: inVoiceChannel,
        channelId: newState.channelId,
        channelIdOld: oldState.channelId,
        channelName: newChannel,
        channelNameOld: oldChannel,
      },
    });
  });

  // Presence update
  client.on("presenceUpdate", (_oldPresence: Presence | null, newPresence: Presence) => {
    if (!newPresence.userId || !newPresence.member) return;
    if (!newPresence.guild) return;

    const userId = newPresence.userId;
    const user = newPresence.member.user;

    if (!user || user.bot) return;

    eventCollector.addEvent({
      type: "presence_update",
      userId: userId,
      timestamp: new Date(),
      data: {
        guildId: newPresence.guild.id,
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
        guildId: reaction.message.guildId,
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
        guildId: member.guild.id,
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
        guildId: member.guild.id,
        username: member.user.username,
      },
    });
  });

  // Message update (edit)
  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    if (!newMessage.guildId) return;

    eventCollector.addEvent({
      type: "message_update",
      userId: newMessage.author.id,
      timestamp: new Date(),
      data: {
        guildId: newMessage.guildId,
        username: newMessage.author.username,
        channelId: newMessage.channelId,
        oldContent: oldMessage.content,
        newContent: newMessage.content,
      },
    });
  });

  // Message delete
  client.on("messageDelete", (message) => {
    if (!message.guildId) return;

    eventCollector.addEvent({
      type: "message_delete",
      userId: message.author?.id || "unknown",
      timestamp: new Date(),
      data: {
        guildId: message.guildId,
        channelId: message.channelId,
        content: message.content,
        author: message.author?.username,
      },
    });
  });

  // Message delete bulk
  client.on("messageDeleteBulk", (messages) => {
    const firstMessage = messages.first();
    if (!firstMessage?.guildId) return;

    eventCollector.addEvent({
      type: "message_delete_bulk",
      userId: "system",
      timestamp: new Date(),
      data: {
        guildId: firstMessage.guildId,
        channelId: firstMessage.channelId,
        count: messages.size,
      },
    });
  });

  // Guild member update (roles, nickname, timeout changes)
  client.on("guildMemberUpdate", (oldMember, newMember) => {
    if (newMember.user.bot) return;

    // Detect what changed
    type MemberChange = { old?: unknown; new?: unknown; added?: string[]; removed?: string[] };
    const changes: Record<string, MemberChange> = {};

    // Nickname change
    if (oldMember.nickname !== newMember.nickname) {
      changes.nickname = { old: oldMember.nickname, new: newMember.nickname };
    }

    // Roles change
    const rolesAdded = newMember.roles.cache.filter(
      (role) => !oldMember.roles.cache.has(role.id)
    );
    const rolesRemoved = oldMember.roles.cache.filter(
      (role) => !newMember.roles.cache.has(role.id)
    );

    if (rolesAdded.size > 0 || rolesRemoved.size > 0) {
      changes.roles = {
        added: rolesAdded.map((r) => r.name),
        removed: rolesRemoved.map((r) => r.name),
      };
    }

    // Timeout change
    if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
      changes.timeout = {
        old: oldMember.communicationDisabledUntil,
        new: newMember.communicationDisabledUntil,
      };
    }

    if (Object.keys(changes).length > 0) {
      eventCollector.addEvent({
        type: "member_update",
        userId: newMember.id,
        timestamp: new Date(),
        data: {
          guildId: newMember.guild.id,
          username: newMember.user.username,
          changes,
        },
      });
    }
  });

  return client;
}
