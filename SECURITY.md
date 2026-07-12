# Security and privacy

Frostflare is designed for local use. It reads Discord activity, including message content when the bot has the required intent, and may send that content to a local llama.cpp endpoint for classification.

- Never commit `.env`, Discord bot tokens, model credentials, or exported Discord data.
- Keep the WebSocket server on loopback, or put remote access behind an authenticated VPN/reverse proxy with TLS.
- Review screenshots and logs for usernames, message text, and server details before sharing them.
- Report suspected vulnerabilities through [GitHub private vulnerability reporting](https://github.com/FrozenScorch/frostflare/security/advisories/new). Do not open a public issue with credentials, exploit details, or personal data.
