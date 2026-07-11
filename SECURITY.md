# Security and privacy

Frostflare is designed for local use. It reads Discord activity, including message content when the bot has the required intent, and may send that content to a local llama.cpp endpoint for classification.

- Never commit `.env`, Discord bot tokens, model credentials, or exported Discord data.
- Keep the WebSocket server on loopback, or put remote access behind an authenticated VPN/reverse proxy with TLS.
- Review screenshots and logs for usernames, message text, and server details before sharing them.
- Report suspected vulnerabilities privately to the repository owner instead of opening a public issue with credentials or personal data.
