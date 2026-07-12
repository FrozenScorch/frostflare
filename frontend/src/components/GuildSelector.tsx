/**
 * GuildSelector Component - Dropdown to select Discord server/guild
 */

import React from "react";
import type { GuildInfo } from "../types";

interface GuildSelectorProps {
  guilds: GuildInfo[];
  selectedGuildId: string | null;
  onGuildChange: (guildId: string | null) => void;
}

export const GuildSelector: React.FC<GuildSelectorProps> = ({
  guilds,
  selectedGuildId,
  onGuildChange,
}) => {
  return (
    <div
      style={{
        marginBottom: "12px",
        paddingBottom: "8px",
        borderBottom: "1px solid #555",
      }}
    >
      <label
        htmlFor="guild-selector"
        style={{
          fontSize: "11px",
          color: "#888",
          marginBottom: "6px",
        }}
      >
        SERVER
      </label>
      <select
        id="guild-selector"
        value={selectedGuildId || "all"}
        onChange={(e) => {
          const value = e.target.value;
          onGuildChange(value === "all" ? null : value);
        }}
        style={{
          width: "100%",
          padding: "8px 10px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "1px solid #555",
          borderRadius: "4px",
          color: "#eee",
          fontSize: "13px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#7289da";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#555";
        }}
      >
        <option value="all">All Servers</option>
        {guilds.map((guild) => (
          <option key={guild.id} value={guild.id}>
            {guild.name} ({guild.memberCount} members)
          </option>
        ))}
      </select>
      {selectedGuildId && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#7289da",
          }}
        >
          {guilds.find((g) => g.id === selectedGuildId)?.name}
        </div>
      )}
    </div>
  );
};

export default GuildSelector;
