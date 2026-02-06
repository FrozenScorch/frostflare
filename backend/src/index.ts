/**
 * Discord Sims Visualizer Backend
 * Main entry point
 */

import dotenv from "dotenv";
import { DiscordBot } from "./discord/client.js";
import { WebSocketServerInstance } from "./websocket/server.js";
import { getLlamaClient } from "./llm/llama.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WS_PORT = parseInt(process.env.WS_PORT || "8000");
const LLAMA_ENDPOINT = process.env.LLAMA_ENDPOINT || "http://localhost:1234";

if (!DISCORD_TOKEN) {
  console.error("Error: DISCORD_TOKEN environment variable is required");
  process.exit(1);
}

/**
 * Main application
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Discord Sims Visualizer Backend");
  console.log("=".repeat(60));
  console.log(`WebSocket Port: ${WS_PORT}`);
  console.log(`Llama Endpoint: ${LLAMA_ENDPOINT}`);
  console.log("=".repeat(60));

  // Check Llama.cpp availability
  console.log("\n[Init] Checking Llama.cpp availability...");
  const llama = getLlamaClient();
  const llamaAvailable = await llama.healthCheck();
  if (llamaAvailable) {
    console.log("[Init] ✓ Llama.cpp is available");
  } else {
    console.log("[Init] ⚠ Llama.cpp is not available, using rule-based classification");
  }

  // Create WebSocket server
  console.log("\n[Init] Starting WebSocket server...");
  const wsServer = new WebSocketServerInstance(WS_PORT);
  console.log(`[Init] ✓ WebSocket server listening on port ${WS_PORT}`);

  // Create Discord bot
  console.log("\n[Init] Starting Discord bot...");
  const bot = new DiscordBot(DISCORD_TOKEN!);

  // Set up WebSocket broadcast for bot
  bot.setWebSocketBroadcast((data: any) => wsServer.broadcast(data));

  try {
    await bot.start();
    console.log("[Init] ✓ Discord bot is running");

    // Log stats
    console.log("\n[Stats] Bot Statistics:");
    console.log(`[Stats] ${bot.getStats().guilds} guilds`);
    console.log(`[Stats] ${bot.getStats().users} users cached`);
    console.log(`[Stats] ${wsServer.getStats().connectedClients} WebSocket clients connected`);
    console.log("\n[Init] ✓ Backend is ready and listening for events!\n");
  } catch (error) {
    console.error("[Init] ✗ Failed to start bot:", error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n\n[Shutdown] Received SIGINT, shutting down gracefully...");
    await bot.stop();
    wsServer.close();
    console.log("[Shutdown] Goodbye!");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n\n[Shutdown] Received SIGTERM, shutting down gracefully...");
    await bot.stop();
    wsServer.close();
    console.log("[Shutdown] Goodbye!");
    process.exit(0);
  });

  // Keep the process running
  process.stdin.resume();
}

// Start the application
main().catch((error) => {
  console.error("[Fatal] Unhandled error:", error);
  process.exit(1);
});
