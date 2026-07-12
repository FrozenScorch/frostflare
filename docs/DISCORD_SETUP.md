# Discord setup

Use a test server you control first. Frostflare reads community activity; tell participants what is being visualized before using it in a real group.

Discord's official [getting started guide](https://docs.discord.com/developers/quick-start/getting-started) has the current Developer Portal screens. The steps below are the Frostflare-specific settings.

## Create the app and bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application and give it a recognizable name.
3. Open **Bot** and create/reset the token.
4. Copy the token once and put it only in `backend/.env` as `DISCORD_TOKEN`.

Never paste the token into chat, a screenshot, an issue, or a committed file. Reset it immediately if it leaks.

## Enable gateway intents

On the **Bot** page, enable these privileged gateway intents:

- Presence Intent
- Server Members Intent
- Message Content Intent

Discord requires privileged intents to be enabled in the portal before a bot may request them. Frostflare uses them for presence, initial member state, and message-driven speech/activity. See Discord's [gateway intent reference](https://docs.discord.com/developers/events/gateway#gateway-intents) for current platform rules.

## Install the bot

1. In the Developer Portal, open **Installation**.
2. Enable installation to a server/guild.
3. Include the `bot` scope in the install link.
4. Frostflare only observes gateway activity; start with no elevated server permissions and add the minimum needed for channels the bot must see.
5. Open the install link, select a test server you administer, and approve the install.

Avoid Administrator permission. Channel visibility and normal Discord permissions still control what the bot can observe.

## Configure and start Frostflare

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```dotenv
DISCORD_TOKEN=paste_your_token_here
LLAMA_ENDPOINT=http://localhost:1234
WS_PORT=8000
WS_HOST=127.0.0.1
```

Then run the backend and frontend in separate terminals:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Open <http://localhost:8500>. The server selector should appear after Discord reports the guild list.

## Validate the setup

- Send a short test message: an avatar should move toward a conversation room.
- Start typing: the avatar should show a typing indicator.
- Join a voice channel: a voice room should appear.
- Start a game or music activity: presence updates should change the room/action when Discord exposes that activity.

If the browser remains empty, use [Troubleshooting](TROUBLESHOOTING.md).
