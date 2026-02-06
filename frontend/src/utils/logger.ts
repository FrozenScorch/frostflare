/**
 * Frontend Logging Utilities
 */

export enum LogLevel {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

/**
 * Format a date for logging
 */
export function formatLogTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Get CSS class for log level
 */
export function getLogLevelClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.INFO:
      return "log-info";
    case LogLevel.SUCCESS:
      return "log-success";
    case LogLevel.WARNING:
      return "log-warning";
    case LogLevel.ERROR:
      return "log-error";
    default:
      return "log-info";
  }
}

/**
 * Get icon for log level
 */
export function getLogLevelIcon(level: LogLevel): string {
  switch (level) {
    case LogLevel.INFO:
      return "ℹ️";
    case LogLevel.SUCCESS:
      return "✅";
    case LogLevel.WARNING:
      return "⚠️";
    case LogLevel.ERROR:
      return "❌";
    default:
      return "📝";
  }
}

/**
 * Create a log entry
 */
export function createLogEntry(
  level: LogLevel,
  message: string,
  data?: any
): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    level,
    message,
    data,
  };
}
