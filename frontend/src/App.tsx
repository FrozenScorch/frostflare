/**
 * App Component - Main application
 */

import React, { useEffect, useState, useMemo } from "react";
import { House3D } from "./components/House3D";
import { ActivityLog } from "./components/ActivityLog";
import { StatsPanel } from "./components/StatsPanel";
import { useWebSocket } from "./hooks/useWebSocket";
import type { Room as RoomConfig, UserState } from "./types";

const App: React.FC = () => {
  const { connected, users, stats, guilds, logs, clearLogs } = useWebSocket();
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

  // Dynamically generate rooms based on activity and voice channels
  const rooms = useMemo(() => {
    // Room type definitions with positions
    const roomTypes = [
      { id: "game_room", name: "Game Room", color: 0x8844ff, position: { x: -15, y: 0, z: -10 }, size: { x: 12, y: 3, z: 12 } },
      { id: "living_room", name: "Living Room", color: 0xffaa66, position: { x: 0, y: 0, z: -10 }, size: { x: 12, y: 3, z: 12 } },
      { id: "media_room", name: "Media Room", color: 0x4466ff, position: { x: 15, y: 0, z: -10 }, size: { x: 12, y: 3, z: 12 } },
      { id: "kitchen", name: "Kitchen", color: 0xffffee, position: { x: -15, y: 0, z: 5 }, size: { x: 12, y: 3, z: 12 } },
      { id: "library", name: "Library", color: 0xffcc88, position: { x: 0, y: 0, z: 5 }, size: { x: 12, y: 3, z: 12 } },
      { id: "music_room", name: "Music Room", color: 0xff6644, position: { x: 15, y: 0, z: 5 }, size: { x: 12, y: 3, z: 12 } },
      { id: "garden", name: "Garden", color: 0x88ff88, position: { x: -7.5, y: 0, z: 15 }, size: { x: 20, y: 3, z: 10 } },
      { id: "bedroom", name: "Bedroom", color: 0xcc88cc, position: { x: 10, y: 0, z: 15 }, size: { x: 12, y: 3, z: 10 } },
    ];

    // Group users by voice channel for dynamic voice channel rooms
    const voiceChannelGroups = new Map<string, UserState[]>();

    usersArray.forEach(user => {
      if (user.voiceChannelId && user.voiceChannelName) {
        if (!voiceChannelGroups.has(user.voiceChannelId)) {
          voiceChannelGroups.set(user.voiceChannelId, []);
        }
        voiceChannelGroups.get(user.voiceChannelId)!.push(user);
      }
    });

    const generatedRooms: RoomConfig[] = [...roomTypes];

    // Add voice channel rooms on the far right
    const voiceChannels = Array.from(voiceChannelGroups.entries());
    const voiceZoneStart = 30;
    const voiceChannelSpacing = 12;

    voiceChannels.forEach(([channelId, channelUsers], index) => {
      const channelName = channelUsers[0]?.voiceChannelName || `Voice Channel ${index + 1}`;
      generatedRooms.push({
        id: channelId,
        name: channelName,
        color: 0x88aacc,
        position: { x: voiceZoneStart, y: 0, z: (index * voiceChannelSpacing) - (voiceChannels.length * voiceChannelSpacing / 2) },
        size: { x: 10, y: 3, z: 10 },
        isVoiceChannel: true,
      });
    });

    return generatedRooms;
  }, [usersArray]);

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
