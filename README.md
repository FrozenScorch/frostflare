# Frostflare

Frostflare is a local-first 3D visualization of Discord activity: a Three.js house for the social layer, a LangGraph pipeline for event processing, and an optional local llama.cpp model for classification and spatial reasoning.

The name is the project’s whole temperature range: frozen rooms, live communities, and a little flame in the machinery.

## What it does

- Collects Discord messages, typing, presence, voice, reactions, joins, leaves, edits, deletes, and member updates.
- Maps activity into a nine-room 3D house with avatars, furniture, speech bubbles, and animations.
- Tracks lightweight relationship signals to place people near conversations and shared voice channels.
- Streams state to the browser over WebSockets.
- Falls back to rule-based classification when llama.cpp is unavailable.

## Architecture

```text
Discord gateway
    -> ingest -> classify -> spatial_analysis -> map_location
    -> detect_interactions -> animation -> broadcast
    -> browser (React + Three.js)
```

The backend is TypeScript/Node.js. The frontend is React, Vite, and React Three Fiber. The LLM integration expects an OpenAI-compatible llama.cpp server at `http://localhost:1234` by default.

## Requirements

- Node.js 18 or newer
- A Discord bot application with these gateway intents enabled in the Discord Developer Portal:
  - Presence Intent
  - Server Members Intent
  - Message Content Intent
- Optional: a local llama.cpp server exposing `/health` and `/v1/chat/completions`

## Quick start

```bash
git clone https://github.com/FrozenScorch/frostflare.git
cd frostflare

cd backend
npm ci
cp .env.example .env
# Edit .env and set DISCORD_TOKEN
npm run dev

# In another terminal
cd ../frontend
npm ci
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

For a production-style check, run `npm run type-check` and `npm run build` in both `backend` and `frontend`.

## Configuration

Backend settings live in `backend/.env`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DISCORD_TOKEN` | required | Discord bot token; never commit it |
| `LLAMA_ENDPOINT` | `http://localhost:1234` | Optional llama.cpp endpoint |
| `WS_PORT` | `8000` | WebSocket port |
| `WS_HOST` | `127.0.0.1` | Bind address; loopback is the safe default |

The frontend uses `VITE_WS_URL` when provided and otherwise connects to `ws://localhost:8000`:

```bash
# frontend/.env.local
VITE_WS_URL=ws://127.0.0.1:8000
```

## Privacy and deployment

Frostflare processes Discord activity and message text. The default setup keeps the backend, llama.cpp, and WebSocket server on the local machine. The WebSocket endpoint has no authentication or TLS of its own, so do not expose it directly to the public internet. If remote access is needed, put it behind a VPN or an authenticated TLS reverse proxy and set `WS_HOST`/`VITE_WS_URL` deliberately.

Do not commit `.env`, bot tokens, Discord exports, screenshots containing user data, or local debugging captures.

## Project status

This is an experimental personal project, not a hosted Discord analytics service. The repository includes build/type-check CI, but it does not yet include an automated gameplay/browser test suite.

## License

MIT. See [LICENSE](LICENSE).
