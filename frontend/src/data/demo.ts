import type { GuildInfo, ServerStats, SocialInteraction, UserState } from "../types";

export interface DemoSnapshot {
  guilds: GuildInfo[];
  users: UserState[];
  interactions: SocialInteraction[];
  stats: ServerStats;
}

const avatar = (initials: string, background: string) =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="24" fill="${background}" />
      <text x="64" y="76" text-anchor="middle" font-family="system-ui, sans-serif" font-size="44" font-weight="700" fill="white">${initials}</text>
    </svg>
  `)}`;

export function createDemoSnapshot(step = 0): DemoSnapshot {
  const now = new Date().toISOString();
  const bobIsTyping = step % 2 === 0;
  const rotatingMessage = [
    "Welcome to Frostflare!",
    "The house moves with your community.",
    "Try dragging the scene to explore.",
  ][step % 3];

  const users: UserState[] = [
    {
      id: "demo-ava",
      username: "ava",
      displayName: "Ava",
      avatar: avatar("A", "#7c3aed"),
      guildId: "demo-guild",
      currentRoom: "game_room",
      position: { x: -12, y: 0, z: -10.4 },
      targetPosition: { x: -12, y: 0, z: -10.4 },
      action: "gaming",
      animation: "gesture",
      mood: "excited",
      lastActivity: now,
      speechBubble: step % 3 === 1 ? "Game night?" : undefined,
      isTyping: false,
      voiceChannelId: null,
      voiceChannelName: null,
    },
    {
      id: "demo-bob",
      username: "bob",
      displayName: "Bob",
      avatar: avatar("B", "#2563eb"),
      guildId: "demo-guild",
      currentRoom: "living_room",
      position: { x: -1.4, y: 0, z: -9 },
      targetPosition: { x: -1.4, y: 0, z: -9 },
      action: "talking",
      animation: "talk",
      mood: "happy",
      lastActivity: now,
      speechBubble: rotatingMessage,
      isTyping: bobIsTyping,
      voiceChannelId: null,
      voiceChannelName: null,
    },
    {
      id: "demo-cam",
      username: "cam",
      displayName: "Cam",
      avatar: avatar("C", "#db2777"),
      guildId: "demo-guild",
      currentRoom: "living_room",
      position: { x: 1.4, y: 0, z: -9 },
      targetPosition: { x: 1.4, y: 0, z: -9 },
      action: "talking",
      animation: "talk",
      mood: "happy",
      lastActivity: now,
      speechBubble: step % 3 === 2 ? "This is cozy." : undefined,
      isTyping: !bobIsTyping,
      voiceChannelId: null,
      voiceChannelName: null,
    },
    {
      id: "demo-dee",
      username: "dee",
      displayName: "Dee",
      avatar: avatar("D", "#0891b2"),
      guildId: "demo-guild",
      currentRoom: "music_room",
      position: { x: 10, y: 0, z: 1.1 },
      targetPosition: { x: 10, y: 0, z: 1.1 },
      action: "listening",
      animation: "dance",
      mood: "focused",
      lastActivity: now,
      isTyping: false,
      voiceChannelId: null,
      voiceChannelName: null,
    },
    {
      id: "demo-eli",
      username: "eli",
      displayName: "Eli",
      avatar: avatar("E", "#ea580c"),
      guildId: "demo-guild",
      currentRoom: "voice:demo-lounge",
      position: { x: 20, y: 0, z: 2.6 },
      targetPosition: { x: 20, y: 0, z: 2.6 },
      action: "talking",
      animation: "talk",
      mood: "excited",
      lastActivity: now,
      speechBubble: "Voice lounge is live!",
      isTyping: false,
      voiceChannelId: "demo-lounge",
      voiceChannelName: "Demo Lounge",
    },
    {
      id: "demo-fin",
      username: "fin",
      displayName: "Fin",
      avatar: avatar("F", "#4f46e5"),
      guildId: "demo-guild",
      currentRoom: "media_room",
      position: { x: 10, y: 0, z: -9 },
      targetPosition: { x: 10, y: 0, z: -9 },
      action: "watching",
      animation: "gesture",
      mood: "focused",
      lastActivity: now,
      isTyping: false,
      voiceChannelId: null,
      voiceChannelName: null,
    },
    {
      id: "demo-gia",
      username: "gia",
      displayName: "Gia",
      avatar: avatar("G", "#a16207"),
      guildId: "demo-guild",
      currentRoom: "library",
      position: { x: -12, y: 0, z: -0.2 },
      targetPosition: { x: -12, y: 0, z: -0.2 },
      action: "reading",
      animation: "idle",
      mood: "focused",
      lastActivity: now,
      isTyping: false,
      voiceChannelId: null,
      voiceChannelName: null,
    },
  ];

  return {
    guilds: [
      {
        id: "demo-guild",
        name: "Frostflare Friends",
        icon: null,
        memberCount: users.length,
      },
    ],
    users,
    interactions: [
      {
        id: "demo-conversation",
        userIds: ["demo-bob", "demo-cam"],
        type: "conversation",
        startTime: now,
        room: "living_room",
      },
    ],
    stats: {
      totalUsers: users.length,
      activeUsers: users.length,
      totalInteractions: 1,
      processedEvents: 24 + step,
    },
  };
}
