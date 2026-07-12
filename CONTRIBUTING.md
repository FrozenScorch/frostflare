# Contributing

Thanks for helping make Frostflare easier and safer to use.

## Development setup

```bash
git clone https://github.com/FrozenScorch/frostflare.git
cd frostflare
npm run setup
npm run demo
```

Use fictional data in demo fixtures, tests, screenshots, and issues. Never commit Discord tokens, exports, real messages, or personally identifying captures.

## Before opening a pull request

```bash
npm run check
```

Then manually open the demo and verify that the house, activity log, server selector, orbit controls, and demo badge render without console errors.

Keep pull requests focused. Explain the user impact, note protocol changes, and update `docs/API.md` whenever the wire contract changes.

## Project conventions

- TypeScript is the source of truth in both packages.
- Normalize Discord.js objects at the collector boundary.
- Keep internal graph state separate from public WebSocket state.
- Preserve deterministic behavior when llama.cpp is unavailable.
- Keep network services bound to loopback by default.
- Prefer accessible labels and reduced-motion-safe UI behavior.

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
