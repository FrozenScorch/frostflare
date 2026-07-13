/**
 * App Component - Main application
 */

import React, { useEffect, useState, useMemo } from "react";
import { House3D } from "./components/House3D";
import { ActivityLog } from "./components/ActivityLog";
import { StatsPanel } from "./components/StatsPanel";
import { useWebSocket } from "./hooks/useWebSocket";
import { buildRooms } from "./data/houseLayout";

const App: React.FC = () => {
  const { mode, connected, users, stats, guilds, logs, clearLogs } = useWebSocket();
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);

  useEffect(() => {
    // Hide loading screen after 2 seconds
    const timer = setTimeout(() => {
      const loadingElement = document.getElementById("loading");
      if (loadingElement) {
        loadingElement.classList.add("hidden");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-select guild with most users on load (if not already selected)
  useEffect(() => {
    if (guilds.length > 0 && !selectedGuildId) {
      // Find guild with highest member count
      const guildWithMostUsers = guilds.reduce((max, guild) =>
        guild.memberCount > max.memberCount ? guild : max
      , guilds[0]);
      setSelectedGuildId(guildWithMostUsers.id);
    }
  }, [guilds, selectedGuildId]);

  // Convert users map to array for rendering, filtered by selected guild
  const usersArray = React.useMemo(() => {
    const allUsers = Array.from(users.values());
    if (selectedGuildId) {
      return allUsers.filter((user) => user.guildId === selectedGuildId);
    }
    return allUsers;
  }, [users, selectedGuildId]);

  const rooms = useMemo(() => buildRooms(usersArray), [usersArray]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 3D Scene */}
      <House3D users={usersArray} rooms={rooms} />

      {/* Stats Panel */}
      <StatsPanel
        stats={stats}
        connected={connected}
        guilds={guilds}
        selectedGuildId={selectedGuildId}
        onGuildChange={setSelectedGuildId}
        users={usersArray}
        rooms={rooms}
      />

      {/* Activity Log */}
      <ActivityLog logs={logs} onClear={clearLogs} maxHeight={300} />

      {mode === "demo" && (
        <div className="demo-banner" role="status">
          <strong>Demo mode</strong>
          <span>Fictional activity · no Discord account or bot token required</span>
        </div>
      )}

      {/* Connection status indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#ccc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: connected ? "#00ff00" : "#ff0000",
            animation: connected ? "pulse 2s infinite" : "none",
          }}
        />
        <span>{mode === "demo" ? "Local demo" : connected ? "Connected" : "Disconnected"}</span>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .log-info {
          border-left: 2px solid #7289da;
        }

        .log-success {
          border-left: 2px solid #00ff00;
        }

        .log-warning {
          border-left: 2px solid #ffaa00;
        }

        .log-error {
          border-left: 2px solid #ff0000;
        }
      `}</style>
    </div>
  );
};

export default App;
