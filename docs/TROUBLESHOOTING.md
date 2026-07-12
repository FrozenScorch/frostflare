# Troubleshooting

## The demo does not open

- Confirm Node.js is 20.19+, 22.13+, or 24+: `node --version`.
- Run `npm run setup` from the repository root.
- Start with `npm run demo`, not the live frontend command.
- Open the exact Vite URL shown in the terminal (normally <http://localhost:8500>).

## The live page says disconnected

- Confirm `npm run dev:backend` is still running.
- Look for `Server listening` on port 8000 in the backend terminal.
- Confirm `VITE_WS_URL` matches `WS_HOST`/`WS_PORT` and uses `ws://` locally.
- Remove `VITE_DEMO_MODE=true` from `frontend/.env.local` when testing live mode.

## The bot exits immediately

The backend requires `DISCORD_TOKEN` in `backend/.env`. Copy from `backend/.env.example`, paste a current token, and restart. If the token ever appeared in a public place, reset it in the Developer Portal first.

## Discord reports disallowed intents

Enable Presence, Server Members, and Message Content under **Bot → Privileged Gateway Intents** in the Discord Developer Portal, then restart the backend. Discord may close a gateway connection when requested privileged intents are not enabled.

## The connection works but the house is empty

- Confirm the bot was installed in the server you selected.
- Generate a message, typing, presence, or voice event after the bot is online.
- Check that the bot can see the test channel.
- Confirm the server appears in the selector.
- Try the demo to separate a WebGL/rendering issue from a Discord setup issue.

## llama.cpp is unavailable

That is okay. Frostflare logs the failed health check and uses rule-based classification and interaction detection. Set `LLAMA_ENDPOINT` only if an OpenAI-compatible local server is running.

## The page is slow

- Close other GPU-heavy tabs.
- Reduce browser zoom or window size.
- Avoid visualizing very large servers; Frostflare is currently an experimental personal project.
- The production bundle is large because it includes Three.js; use `npm run build --prefix frontend` to test the optimized build.

## Remote access fails

The WebSocket server defaults to loopback intentionally. Do not solve this by exposing port 8000 directly. Use a VPN or an authenticated TLS reverse proxy, then configure `WS_HOST` and `VITE_WS_URL` deliberately.

## Still stuck?

Run `npm run check` and include the failing command, Node version, operating system, and redacted logs in a GitHub issue. Never include tokens, private messages, real usernames, or server IDs.
