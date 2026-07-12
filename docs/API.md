# WebSocket API

Frostflare exposes a small, read-mostly WebSocket API for the browser visualization. The default endpoint is `ws://127.0.0.1:8000`.

This API is currently experimental. There is no authentication, authorization, TLS, or version negotiation, so bind it to loopback and do not expose it directly to the internet.

## Connection lifecycle

On connection, the server sends:

1. `connected`
2. The most recent `state_update`, or `initial_state` if Discord has not produced state yet
3. A `guilds_list` after the Discord bot is ready

The frontend sends `ping` every 30 seconds and reconnects five seconds after an unexpected close. Calling the hook's `disconnect()` method disables that reconnect loop.

All timestamps on the wire are ISO 8601 strings.

## Client messages

### `ping`

Checks that the connection is alive.

```json
{ "type": "ping" }
```

The server replies with `pong`.

### `request_state`

Requests the latest cached state.

```json
{ "type": "request_state" }
```

The server replies with its latest `state_update`, or `initial_state` if no update has been produced.

Unknown message types and malformed JSON are logged by the server but do not currently receive an error response.

## Server messages

### `connected`

```json
{
  "type": "connected",
  "message": "Connected to Frostflare",
  "timestamp": "2026-07-11T20:00:00.000Z"
}
```

### `initial_state`

```json
{
  "type": "initial_state",
  "message": "Waiting for Discord events...",
  "timestamp": "2026-07-11T20:00:00.000Z"
}
```

### `pong`

```json
{
  "type": "pong",
  "timestamp": "2026-07-11T20:00:30.000Z"
}
```

### `guilds_list`

```json
{
  "type": "guilds_list",
  "timestamp": "2026-07-11T20:00:00.000Z",
  "guilds": [
    {
      "id": "123456789012345678",
      "name": "Friends Server",
      "icon": null,
      "memberCount": 5
    }
  ]
}
```

### `state_update`

The browser replaces its current user, interaction, and statistic state with each update.

```json
{
  "type": "state_update",
  "timestamp": "2026-07-11T20:00:04.000Z",
  "users": [
    {
      "id": "111111111111111111",
      "username": "ava",
      "displayName": "Ava",
      "avatar": "https://cdn.discordapp.com/...",
      "guildId": "123456789012345678",
      "currentRoom": "game_room",
      "position": { "x": -15, "y": 0, "z": -10 },
      "targetPosition": { "x": -14, "y": 0, "z": -9 },
      "action": "gaming",
      "animation": "gesture",
      "mood": "excited",
      "lastActivity": "2026-07-11T20:00:03.000Z",
      "speechBubble": "Game night?",
      "isTyping": false,
      "voiceChannelId": null,
      "voiceChannelName": null
    }
  ],
  "interactions": [
    {
      "id": "interaction-id",
      "userIds": ["111111111111111111", "222222222222222222"],
      "type": "gaming_together",
      "startTime": "2026-07-11T20:00:03.000Z",
      "room": "game_room"
    }
  ],
  "stats": {
    "totalUsers": 5,
    "activeUsers": 3,
    "totalInteractions": 1,
    "processedEvents": 2
  }
}
```

## State values

`currentRoom` is normally one of `living_room`, `game_room`, `kitchen`, `library`, `media_room`, `music_room`, `garden`, `bedroom`, or `entrance`. Voice rooms use dynamic IDs.

`action` is one of `idle`, `walking`, `talking`, `gaming`, `eating`, `reading`, `watching`, `listening`, `sleeping`, or `typing`.

`animation` is one of `idle`, `walk`, `talk`, `gesture`, `sleep`, or `dance`.

`mood` is one of `happy`, `neutral`, `sad`, `excited`, `focused`, or `bored`.

## Minimal JavaScript client

```js
const socket = new WebSocket("ws://127.0.0.1:8000");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ type: "request_state" }));
});

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.type === "state_update") {
    console.table(message.users.map(({ displayName, currentRoom, action }) => ({
      displayName,
      currentRoom,
      action,
    })));
  }
});
```

See [the cookbook](COOKBOOK.md#inspect-the-live-websocket-stream) for a terminal client.

## Optional llama.cpp API

When `LLAMA_ENDPOINT` is available, the backend calls two OpenAI-compatible routes:

- `GET /health`
- `POST /v1/chat/completions`

The completion request uses a single user message, JSON-oriented prompts, and the model name `gpt-3.5-turbo` for compatibility. If the health check or completion fails, rule-based behavior continues without stopping the visualization.

## Source of truth

- Server transport: `backend/src/websocket/server.ts`
- Wire serialization: `backend/src/agent/nodes/broadcast.ts`
- Guild serialization: `backend/src/discord/client.ts`
- Frontend consumer and reconnect behavior: `frontend/src/hooks/useWebSocket.ts`
- Frontend wire types: `frontend/src/types/index.ts`
