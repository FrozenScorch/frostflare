/**
 * ActivityLog Component - Debug logging panel
 */

import React, { useRef, useEffect } from "react";
import type { LogEntry } from "../utils/logger";
import { formatLogTime, getLogLevelClass, getLogLevelIcon } from "../utils/logger";

interface ActivityLogProps {
  logs: LogEntry[];
  onClear: () => void;
  maxHeight?: number;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  logs,
  onClear,
  maxHeight = 400,
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 350,
        maxHeight: `${maxHeight}px`,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderRadius: "8px",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        border: "1px solid #444",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          paddingBottom: "8px",
          borderBottom: "1px solid #555",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
          📋 Activity Log
        </div>
        <button
          onClick={onClear}
          style={{
            backgroundColor: "#7289da",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
          minHeight: "200px",
          maxHeight: `${maxHeight - 60}px`,
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic", padding: "10px" }}>
            No logs yet...
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: "4px 6px",
                marginBottom: "2px",
                borderRadius: "3px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                fontSize: "11px",
                lineHeight: "1.4",
              }}
              className={`log-entry ${getLogLevelClass(log.level)}`}
            >
              <span style={{ color: "#888" }}>
                [{formatLogTime(log.timestamp)}]
              </span>{" "}
              <span style={{ marginRight: "4px" }}>
                {getLogLevelIcon(log.level)}
              </span>
              <span>{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>

      {/* Footer with stats */}
      <div
        style={{
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid #555",
          fontSize: "10px",
          color: "#888",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{logs.length} entries</span>
        <span>Frostflare</span>
      </div>
    </div>
  );
};

export default ActivityLog;
