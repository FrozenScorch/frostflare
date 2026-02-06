/**
 * WebSocket Hook for Frontend-Backend Communication
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { WebSocketMessage, UserState, SocialInteraction, ServerStats } from "../types";
import { createLogEntry, LogLevel } from "../utils/logger";
import type { LogEntry } from "../utils/logger";

interface UseWebSocketResult {
  connected: boolean;
  users: Map<string, UserState>;
  interactions: SocialInteraction[];
  stats: ServerStats | null;
  logs: LogEntry[];
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
}

const WS_URL = `ws://localhost:8000`;

export function useWebSocket(): UseWebSocketResult {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<Map<string, UserState>>(new Map());
  const [interactions, setInteractions] = useState<SocialInteraction[]>([]);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();
  const heartbeatIntervalRef = useRef<number>();

  const addLog = useCallback((level: LogLevel, message: string) => {
    const log = createLogEntry(level, message);
    setLogs((prev) => [...prev.slice(-99), log]); // Keep last 100 logs
    console.log(`[${level.toUpperCase()}]`, message);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      addLog(LogLevel.WARNING, "Already connected");
      return;
    }

    addLog(LogLevel.INFO, `Connecting to ${WS_URL}...`);

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        addLog(LogLevel.SUCCESS, "Connected to server");

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000); // Every 30 seconds
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          switch (data.type) {
            case "connected":
              addLog(LogLevel.SUCCESS, data.message || "Connected");
              break;

            case "state_update":
              if (data.users) {
                const newUsers = new Map<string, UserState>();
                data.users.forEach((user) => {
                  newUsers.set(user.id, user);
                });
                setUsers(newUsers);
              }
              if (data.interactions) {
                setInteractions(data.interactions);
              }
              if (data.stats) {
                setStats(data.stats);
              }
              addLog(LogLevel.INFO, `State update: ${data.users?.length || 0} users, ${data.interactions?.length || 0} interactions`);
              break;

            case "initial_state":
              addLog(LogLevel.INFO, data.message || "Initial state received");
              break;

            case "pong":
              // Heartbeat response, no action needed
              break;

            default:
              addLog(LogLevel.INFO, `Received: ${data.type}`);
          }
        } catch (error) {
          addLog(LogLevel.ERROR, `Error parsing message: ${error}`);
        }
      };

      ws.onerror = (error) => {
        addLog(LogLevel.ERROR, `WebSocket error: ${error}`);
      };

      ws.onclose = () => {
        setConnected(false);
        addLog(LogLevel.WARNING, "Disconnected from server");

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          addLog(LogLevel.INFO, "Attempting to reconnect...");
          connect();
        }, 5000);
      };
    } catch (error) {
      addLog(LogLevel.ERROR, `Failed to connect: ${error}`);
    }
  }, [addLog]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    addLog(LogLevel.INFO, "Disconnected");
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connected,
    users,
    interactions,
    stats,
    logs,
    connect,
    disconnect,
    clearLogs,
  };
}
