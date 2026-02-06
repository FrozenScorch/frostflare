/**
 * WebSocket Server for Frontend Communication
 */

import { WebSocketServer, WebSocket } from "ws";
import { setWsBroadcast } from "../agent/nodes/broadcast.js";

export class WebSocketServerInstance {
  private wss: WebSocketServer;
  private port: number;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    this.port = port;
    this.wss = new WebSocketServer({ port: this.port });

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
   * Handle new WebSocket connection
   */
  private handleConnection(ws: WebSocket) {
    console.log("[WebSocket] New client connected");
    this.clients.add(ws);

    // Send welcome message
    this.sendToClient(ws, {
      type: "connected",
      message: "Connected to Discord Sims Visualizer",
      timestamp: new Date().toISOString(),
    });

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

    // Send initial state
    this.sendToClient(ws, {
      type: "initial_state",
      message: "Waiting for Discord events...",
      timestamp: new Date().toISOString(),
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
          // Request full state (can be implemented to cache and send)
          this.sendToClient(ws, {
            type: "state_request_received",
            timestamp: new Date().toISOString(),
          });
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
