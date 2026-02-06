/**
 * StatsPanel Component - Server statistics display
 */

import React from "react";
import type { ServerStats } from "../types";

interface StatsPanelProps {
  stats: ServerStats | null;
  connected: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, connected }) => {
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
          Discord Sims Visualizer
        </div>
      </div>

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

      {/* Room legend */}
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
            fontSize: "11px",
          }}
        >
          <RoomLegend name="Living Room" color="#cc8888" />
          <RoomLegend name="Game Room" color="#88cc44" />
          <RoomLegend name="Kitchen" color="#cccc88" />
          <RoomLegend name="Library" color="#8888cc" />
          <RoomLegend name="Media Room" color="#cc88cc" />
          <RoomLegend name="Music Room" color="#88cccc" />
          <RoomLegend name="Garden" color="#44cc44" />
          <RoomLegend name="Bedroom" color="#888888" />
          <RoomLegend name="Entrance" color="#88cc88" />
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
}

const RoomLegend: React.FC<RoomLegendProps> = ({ name, color }) => {
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
      <span style={{ color: "#ccc" }}>{name}</span>
    </div>
  );
};

export default StatsPanel;
