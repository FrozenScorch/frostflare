/**
 * App Component - Main application
 */

import React, { useEffect } from "react";
import { House3D } from "./components/House3D";
import { ActivityLog } from "./components/ActivityLog";
import { StatsPanel } from "./components/StatsPanel";
import { useWebSocket } from "./hooks/useWebSocket";

const App: React.FC = () => {
  const { connected, users, stats, logs, clearLogs } = useWebSocket();

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

  // Convert users map to array for rendering
  const usersArray = React.useMemo(() => {
    return Array.from(users.values());
  }, [users]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 3D Scene */}
      <House3D users={usersArray} />

      {/* Stats Panel */}
      <StatsPanel stats={stats} connected={connected} />

      {/* Activity Log */}
      <ActivityLog logs={logs} onClear={clearLogs} />

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
        <span>{connected ? "Connected" : "Disconnected"}</span>
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
