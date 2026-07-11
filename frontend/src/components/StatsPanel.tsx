/**
 * StatsPanel Component - Server statistics display with dynamic rooms
 */

import React, { useMemo } from "react";
import type { ServerStats, GuildInfo, UserState, Room as RoomConfig } from "../types";
import { GuildSelector } from "./GuildSelector";

interface StatsPanelProps {
  stats: ServerStats | null;
  connected: boolean;
  guilds: GuildInfo[];
  selectedGuildId: string | null;
  onGuildChange: (guildId: string | null) => void;
  users: UserState[];
  rooms: RoomConfig[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  connected,
  guilds,
  selectedGuildId,
  onGuildChange,
  users,
  rooms,
}) => {
  // Calculate user count per room
  const roomUserCounts = useMemo(() => {
    const counts = new Map<string, number>();
    users.forEach(user => {
      const room = user.currentRoom || "unknown";
      counts.set(room, (counts.get(room) || 0) + 1);
    });
    return counts;
  }, [users]);

  // Format room color to hex string
  const formatColor = (color: number): string => {
    return "#" + color.toString(16).padStart(6, "0");
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 280,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderRadius: "8px",
        padding: "15px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "13px",
        color: "#eee",
        border: "1px solid #444",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: "1px solid #555",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: connected ? "#00ff00" : "#ff0000",
            marginRight: "8px",
            animation: connected ? "pulse 2s infinite" : "none",
          }}
        />
        <div style={{ fontWeight: "bold", fontSize: "15px" }}>
          Frostflare
        </div>
      </div>

      {/* Guild Selector */}
      {guilds.length > 0 && (
        <GuildSelector
          guilds={guilds}
          selectedGuildId={selectedGuildId}
          onGuildChange={onGuildChange}
        />
      )}

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <StatRow
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="👥"
        />
        <StatRow
          label="Active Users"
          value={stats?.activeUsers ?? 0}
          icon="✨"
        />
        <StatRow
          label="Interactions"
          value={stats?.totalInteractions ?? 0}
          icon="💬"
        />
        <StatRow
          label="Events Processed"
          value={stats?.processedEvents ?? 0}
          icon="📊"
        />
      </div>

      {/* Dynamic Room legend */}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "8px",
          borderTop: "1px solid #555",
        }}
      >
        <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>
          ROOMS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "11px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {rooms.map(room => (
            <RoomLegend
              key={room.id}
              name={room.name}
              color={formatColor(room.color)}
              userCount={roomUserCounts.get(room.id) || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatRowProps {
  label: string;
  value: number;
  icon: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, icon }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      <span style={{ color: "#aaa" }}>
        {icon} {label}
      </span>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          color: "#7289da",
        }}
      >
        {value}
      </span>
    </div>
  );
};

interface RoomLegendProps {
  name: string;
  color: string;
  userCount: number;
}

const RoomLegend: React.FC<RoomLegendProps> = ({ name, color, userCount }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: color,
          borderRadius: "2px",
        }}
      />
      <span style={{ color: "#ccc", flex: 1 }}>{name}</span>
      <span style={{ color: "#7289da", fontWeight: "bold" }}>{userCount}</span>
    </div>
  );
};

export default StatsPanel;
