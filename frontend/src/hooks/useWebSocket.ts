/**
 * WebSocket Hook for Frontend-Backend Communication
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { WebSocketMessage, UserState, SocialInteraction, ServerStats, GuildInfo } from "../types";
import { createLogEntry, LogLevel } from "../utils/logger";
import type { LogEntry } from "../utils/logger";
import { createDemoSnapshot } from "../data/demo";

interface UseWebSocketResult {
  mode: "demo" | "live";
  connected: boolean;
  users: Map<string, UserState>;
  interactions: SocialInteraction[];
  stats: ServerStats | null;
  guilds: GuildInfo[];
  logs: LogEntry[];
  connect: () => void;
  disconnect: () => void;
  clearLogs: () => void;
}

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export function useWebSocket(): UseWebSocketResult {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<Map<string, UserState>>(new Map());
  const [interactions, setInteractions] = useState<SocialInteraction[]>([]);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const demoIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const shouldReconnectRef = useRef(true);

  const addLog = useCallback((level: LogLevel, message: string) => {
    const log = createLogEntry(level, message);
    setLogs((prev) => [...prev.slice(-99), log]); // Keep last 100 logs
    console.log(`[${level.toUpperCase()}]`, message);
  }, []);

  const handleMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case "connected":
        addLog(LogLevel.SUCCESS, data.message || "Connected");
        break;

      case "state_update":
        if (data.users) {
          setUsers(new Map(data.users.map((user) => [user.id, user])));
        }
        if (data.interactions) {
          setInteractions(data.interactions);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        addLog(
          LogLevel.INFO,
          `State update: ${data.users?.length || 0} users, ${data.interactions?.length || 0} interactions`
        );
        break;

      case "guilds_list":
        if (data.guilds) {
          setGuilds(data.guilds);
          addLog(LogLevel.SUCCESS, `Received guild list: ${data.guilds.length} guilds`);
        }
        break;

      case "initial_state":
        addLog(LogLevel.INFO, data.message || "Initial state received");
        break;

      case "pong":
        break;

      default:
        addLog(LogLevel.INFO, `Received: ${data.type}`);
    }
  }, [addLog]);

  const connect = useCallback(() => {
    if (DEMO_MODE) {
      return;
    }

    shouldReconnectRef.current = true;
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
          handleMessage(data);
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

        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            addLog(LogLevel.INFO, "Attempting to reconnect...");
            connect();
          }, 5000);
        }
      };
    } catch (error) {
      addLog(LogLevel.ERROR, `Failed to connect: ${error}`);
    }
  }, [addLog, handleMessage]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
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

  // Start the local fixture or connect to the live backend on mount.
  useEffect(() => {
    if (DEMO_MODE) {
      let step = 0;
      const applySnapshot = () => {
        const snapshot = createDemoSnapshot(step);
        handleMessage({
          type: "guilds_list",
          timestamp: new Date().toISOString(),
          guilds: snapshot.guilds,
        });
        handleMessage({
          type: "state_update",
          timestamp: new Date().toISOString(),
          users: snapshot.users,
          interactions: snapshot.interactions,
          stats: snapshot.stats,
        });
        step += 1;
      };

      applySnapshot();
      setConnected(true);
      addLog(LogLevel.SUCCESS, "Demo mode started — using fictional local activity");
      demoIntervalRef.current = setInterval(applySnapshot, 4000);

      return () => {
        if (demoIntervalRef.current) {
          clearInterval(demoIntervalRef.current);
        }
      };
    }

    connect();
    return () => {
      disconnect();
    };
  }, [addLog, connect, disconnect, handleMessage]);

  return {
    mode: DEMO_MODE ? "demo" : "live",
    connected,
    users,
    interactions,
    stats,
    guilds,
    logs,
    connect,
    disconnect,
    clearLogs,
  };
}
