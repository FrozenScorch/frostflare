/**
 * Main entry point for frontend
 */

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Add unhandled rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Main.tsx: Starting application...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, creating React root...');
  try {
    ReactDOM.createRoot(rootElement).render(<App />);
    console.log('React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
}
