# Frostflare: product overview

## The problem

Community software usually reduces presence to a feed, member list, or analytics dashboard. Those views report activity, but they do not communicate the feeling of a room: who is together, where conversation is forming, or how games, music, voice, and messages shape the space.

Frostflare turns Discord activity into a living 3D house so a community can be understood spatially rather than as another table of metrics.

## Who it is for

- Discord communities that want an ambient shared display.
- Community operators exploring presence without adding another moderation dashboard.
- Creative technologists building spatial interfaces from live event streams.
- Developers evaluating local-first Three.js and LangGraph interaction patterns.

## Product promise

Make community activity glanceable and expressive while keeping the underlying event path visible and locally operable.

The intended outcomes are a stronger sense of shared presence and faster recognition of active spaces. These are experience goals; no retention or engagement lift is claimed without community evidence.

## Why it is different

- **Presence becomes place.** Voice, games, music, messages, and status map into rooms and movement.
- **The demo needs no Discord account.** Fictional fixtures make the product evaluable before credentials.
- **Deterministic mode still works.** Model reasoning is optional rather than required for the core scene.
- **The event stream stays visible.** A WebSocket contract connects classification to the interface.
- **Local-first operation.** Bot, backend, model, and browser can run on infrastructure the community controls.

## The product experience

1. Start in fictional demo mode.
2. Observe people, rooms, conversations, and activity changes.
3. Inspect the event log to connect visual behavior to source events.
4. Add a Discord application and explicitly approved Gateway intents.
5. Run the local backend and connect the live scene.
6. Extend a classifier or room behavior without changing the presentation contract.

## Proof available today

- Public hosted visual demo and repository screenshot.
- Token-free fictional local demo.
- React and Three.js scene.
- Discord Gateway event pipeline.
- LangGraph spatial analysis with deterministic fallback.
- Documented WebSocket API, setup, cookbook, and troubleshooting.

## How to evaluate it

Evaluate fictional mode first. Then connect a disposable test server and verify that a message, voice move, game status, and music event each create an understandable visual change without leaking message content into an unintended surface.

## Deployment and trust

Live mode requires Discord intents and a WebSocket service. Keep the backend on localhost or a trusted network unless authentication, TLS, rate limits, and event-retention policy have been added. Review [SECURITY.md](../SECURITY.md) and the [Discord setup guide](DISCORD_SETUP.md) before connecting a real community.

## Current limits

- The live WebSocket is not a hardened public multi-tenant service.
- Large-community scale and long-session replay need further validation.
- Visual accessibility modes are incomplete.
- The product does not claim moderation, analytics, or surveillance functionality.

## Roadmap and evidence

- Community-configured room and activity semantics.
- Replayable event sessions and clearer performance envelopes.
- Visual accessibility and reduced-motion modes.
- [Architecture](ARCHITECTURE.md)
- [WebSocket API](API.md)
- [Cookbook](COOKBOOK.md)
- [Canonical repository](https://github.com/FrozenScorch/frostflare)
