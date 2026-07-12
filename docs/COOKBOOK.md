# Frostflare cookbook

These recipes start with the smallest useful experience and progress toward customization.

## Run the fictional demo

Use this when you want to explore the interface without Discord credentials.

```bash
npm run setup
npm run demo
```

Open <http://localhost:8500>. The browser loads `frontend/.env.demo`, bypasses the WebSocket, and refreshes fictional activity every four seconds.

To customize the cast or activity, edit `frontend/src/data/demo.ts`. Keep every fixture fictional before committing screenshots.

## Connect a real Discord server

Complete [Discord setup](DISCORD_SETUP.md), then:

```bash
# macOS/Linux
cp backend/.env.example backend/.env

# Set DISCORD_TOKEN in backend/.env, then run:
npm run dev:backend
```

In a second terminal:

```bash
npm run dev:frontend
```

The frontend defaults to `ws://localhost:8000`. If the backend uses another port or host, create `frontend/.env.local`:

```dotenv
VITE_WS_URL=ws://127.0.0.1:9000
```

## Inspect the live WebSocket stream

With the backend running, use its installed `ws` dependency to print message types on every supported Node version:

```bash
cd backend
node --input-type=module -e "import WebSocket from 'ws';const ws=new WebSocket('ws://127.0.0.1:8000');ws.on('message',data=>{const m=JSON.parse(data.toString());console.log(m.type,m.users?.length??'')})"
```

Request the cached state after connecting:

```js
const ws = new WebSocket("ws://127.0.0.1:8000");
ws.onopen = () => ws.send(JSON.stringify({ type: "request_state" }));
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

The complete contract is in [API.md](API.md).

## Use an optional local model

Start an OpenAI-compatible llama.cpp server with:

- `GET /health`
- `POST /v1/chat/completions`

Then point Frostflare to it:

```dotenv
LLAMA_ENDPOINT=http://127.0.0.1:1234
```

Restart the backend. A failed health check automatically keeps the deterministic rule-based pipeline active, so you can compare behavior without changing code.

## Add a new Discord event

1. Subscribe to the Discord.js event in `backend/src/discord/events.ts`.
2. Normalize it to `{ type, userId, timestamp, data }` and call the collector's `addEvent` method.
3. Add the event type to `backend/src/agent/state.ts`.
4. Handle it in `backend/src/agent/nodes/ingest.ts` and update the user's canonical state.
5. Run `npm run check` and verify the resulting `state_update` against [API.md](API.md).

Keep raw Discord.js objects out of graph state. Normalize only the fields the pipeline needs, and never log message content or tokens.

## Add a graph behavior

Graph order is defined in `backend/src/agent/graph.ts`.

1. Create a node under `backend/src/agent/nodes/` that accepts and returns the graph state shape.
2. Export it from `backend/src/agent/nodes/index.ts`.
3. Add the node and edge in `createGraph()`.
4. Decide whether each returned field replaces or accumulates state; reducers live in `backend/src/agent/state.ts`.
5. Keep `broadcast` last so the browser receives the completed state.

## Build a different client

Any local client that speaks the [WebSocket API](API.md) can replace the included frontend. A useful client should:

- handle `initial_state` before the first Discord event;
- replace its view on `state_update`;
- tolerate unknown fields and message types;
- send periodic `ping` messages;
- reconnect with bounded backoff;
- avoid exposing the unauthenticated socket outside a trusted network.

## Share a remote view safely

Do not bind Frostflare directly to a public interface. The WebSocket protocol has no built-in authentication or TLS.

For a trusted remote viewer:

1. Keep Frostflare on a private host.
2. Reach it through a VPN, or use an authenticated reverse proxy that terminates TLS.
3. Set `WS_HOST` deliberately on the backend.
4. Set `VITE_WS_URL` to the protected `wss://` endpoint.
5. Confirm no real names or message text appear in screenshots or logs before sharing them.

The frontend also binds to loopback by default. For a deliberate, trusted LAN-only demo, run `npm run demo --prefix frontend -- --host 0.0.0.0` and use your firewall to restrict who can connect.
