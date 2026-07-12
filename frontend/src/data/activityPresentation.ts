import type { UserState } from "../types";

export interface ActivityPresentation {
  icon: string;
  label: string;
  color: string;
}

export function getActivityPresentation(user: UserState): ActivityPresentation {
  if (user.isTyping) {
    return { icon: "⌨️", label: "Typing", color: "#67d9bf" };
  }
  if (user.voiceChannelId && user.voiceChannelName) {
    return { icon: "🎙️", label: user.voiceChannelName, color: "#72b7e3" };
  }

  switch (user.action) {
    case "gaming": return { icon: "🖥️", label: "Gaming", color: "#b892ff" };
    case "listening": return { icon: "🎧", label: "Listening", color: "#ff8c7a" };
    case "watching": return { icon: "📺", label: "Watching", color: "#7fa2ff" };
    case "reading": return { icon: "📖", label: "Reading", color: "#e4b86e" };
    case "typing": return { icon: "⌨️", label: "Typing", color: "#67d9bf" };
    case "sleeping": return { icon: "💤", label: "Sleeping", color: "#c99bd8" };
    case "eating": return { icon: "🍽️", label: "Eating", color: "#f1c36d" };
    case "talking": return { icon: "💬", label: "Chatting", color: "#78c6ff" };
    case "walking": return { icon: "🚶", label: "Moving", color: "#b7c0d1" };
    default: return { icon: "•", label: "Online", color: "#aeb8c8" };
  }
}
