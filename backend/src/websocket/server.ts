/**
 * WebSocket Server for Frontend Communication
 */

import { WebSocketServer, WebSocket } from "ws";
import { setWsBroadcast } from "../agent/nodes/broadcast.js";

// Forward declaration for Discord bot
interface DiscordBot {
  broadcastGuildList(): void;
}

export class WebSocketServerInstance {
  private wss: WebSocketServer;
  private port: number;
  private host: string;
  private clients: Set<WebSocket> = new Set();
  private discordBot: DiscordBot | null = null;
  private lastState: any = null;  // Store the last state update

  constructor(port: number, host = process.env.WS_HOST || "127.0.0.1") {
    this.port = port;
    this.host = host;
    this.wss = new WebSocketServer({ port: this.port, host: this.host });

    this.wss.on("listening", () => {
      console.log(`[WebSocket] Server listening on port ${this.port}`);
    });

    this.wss.on("connection", (ws: WebSocket) => {
      this.handleConnection(ws);
    });

    // Register broadcast function with LangGraph
    setWsBroadcast((data: any) => this.broadcast(data));

    this.wss.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });
  }

  /**
   * Set Discord bot reference (called after bot is initialized)
   */
  setDiscordBot(bot: DiscordBot) {
    this.discordBot = bot;
    console.log("[WebSocket] Discord bot reference registered");
  }

  /**
   * Handle new WebSocket connection
   */
  private handleConnection(ws: WebSocket) {
    console.log("[WebSocket] New client connected");
    this.clients.add(ws);

    // Send welcome message
    this.sendToClient(ws, {
      type: "connected",
      message: "Connected to Frostflare",
      timestamp: new Date().toISOString(),
    });

    // Send the last known state if available
    if (this.lastState) {
      console.log("[WebSocket] Sending current state to new client");
      this.sendToClient(ws, this.lastState);
    } else {
      // No state yet, send waiting message
      this.sendToClient(ws, {
        type: "initial_state",
        message: "Waiting for Discord events...",
        timestamp: new Date().toISOString(),
      });
    }

    // Send guild list to new client
    if (this.discordBot) {
      this.discordBot.broadcastGuildList();
    }

    // Handle incoming messages
    ws.on("message", (data: Buffer) => {
      this.handleMessage(ws, data);
    });

    // Handle disconnection
    ws.on("close", () => {
      console.log("[WebSocket] Client disconnected");
      this.clients.delete(ws);
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error("[WebSocket] Client error:", error);
      this.clients.delete(ws);
    });
  }

  /**
   * Handle incoming message from client
   */
  private handleMessage(ws: WebSocket, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());
      console.log("[WebSocket] Received:", message.type);

      // Handle different message types
      switch (message.type) {
        case "ping":
          this.sendToClient(ws, { type: "pong", timestamp: new Date().toISOString() });
          break;

        case "request_state":
          if (this.lastState) {
            this.sendToClient(ws, this.lastState);
          } else {
            this.sendToClient(ws, {
              type: "initial_state",
              message: "Waiting for Discord events...",
              timestamp: new Date().toISOString(),
            });
          }
          break;

        default:
          console.log("[WebSocket] Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("[WebSocket] Error parsing message:", error);
    }
  }

  /**
   * Send message to specific client
   */
  private sendToClient(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (error) {
        console.error("[WebSocket] Error sending to client:", error);
        this.clients.delete(ws);
      }
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(data: any) {
    const message = JSON.stringify(data);
    let sentCount = 0;

    // Store state updates for new clients
    if (data.type === "state_update") {
      this.lastState = data;
      console.log(`[WebSocket] Stored state: ${data.users?.length || 0} users`);
    }

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
          sentCount++;
        } catch (error) {
          console.error("[WebSocket] Error broadcasting to client:", error);
          this.clients.delete(client);
        }
      }
    }

    if (sentCount > 0) {
      console.log(`[WebSocket] Broadcast to ${sentCount} clients`);
    }
  }

  /**
   * Get server stats
   */
  getStats() {
    return {
      port: this.port,
      host: this.host,
      connectedClients: this.clients.size,
    };
  }

  /**
   * Close the server
   */
  close() {
    for (const client of this.clients) {
      client.close();
    }
    this.wss.close();
    console.log("[WebSocket] Server closed");
  }
}
