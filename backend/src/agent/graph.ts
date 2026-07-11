/**
 * LangGraph State Machine for Frostflare
 */

import { StateGraph, END } from "@langchain/langgraph";
import { StateAnnotation } from "./state.js";
import {
  ingestNode,
  classifyNode,
  mapLocationNode,
  animationNode,
  interactionsNode,
  broadcastNode,
  spatialAnalysisNode,
} from "./nodes/index.js";

/**
 * Create the Frostflare state graph
 */
export function createDiscordSimsGraph() {
  // Create the state graph with StateAnnotation
  const workflow = new StateGraph(StateAnnotation);

  // Add nodes
  workflow.addNode("ingest", ingestNode);
  workflow.addNode("classify", classifyNode);
  workflow.addNode("spatial_analysis", spatialAnalysisNode);
  workflow.addNode("map_location", mapLocationNode);
  workflow.addNode("detect_interactions", interactionsNode);
  workflow.addNode("animation", animationNode);
  workflow.addNode("broadcast", broadcastNode);

  // Set entry point and add edges with type assertions for LangGraph compatibility
  (workflow as any).setEntryPoint("ingest");
  (workflow as any).addEdge("ingest", "classify");
  (workflow as any).addEdge("classify", "spatial_analysis");
  (workflow as any).addEdge("spatial_analysis", "map_location");
  (workflow as any).addEdge("map_location", "detect_interactions");
  (workflow as any).addEdge("detect_interactions", "animation");
  (workflow as any).addEdge("animation", "broadcast");
  (workflow as any).addEdge("broadcast", END);

  // Compile the graph
  const app = workflow.compile();

  return app;
}

// Singleton instance
let graphInstance: ReturnType<typeof createDiscordSimsGraph> | null = null;

/**
 * Get the graph instance
 */
export function getGraph() {
  if (!graphInstance) {
    graphInstance = createDiscordSimsGraph();
  }
  return graphInstance;
}

// Persistent state between event batches
let persistentUsers: Map<string, any> = new Map();
let persistentInteractions: Map<string, any> = new Map();
let persistentSpatialAnalysis: Map<string, any> = new Map();

/**
 * Get the persistent users map
 */
export function getPersistentUsers() {
  return persistentUsers;
}

/**
 * Reset persistent state (for testing or guild changes)
 */
export function resetPersistentState() {
  persistentUsers.clear();
  persistentInteractions.clear();
  persistentSpatialAnalysis.clear();
  console.log("[Graph] Persistent state reset");
}

/**
 * Run the graph with events
 */
export async function processEvents(events: any[]) {
  const graph = getGraph();

  const initialState = {
    users: persistentUsers,  // Use persistent users instead of new Map()
    events: events,
    interactions: Array.from(persistentInteractions.values()),
    timestamp: new Date(),
    processedCount: 0,
    spatialAnalysis: persistentSpatialAnalysis,
  };

  const result = await graph.invoke(initialState);

  // Update persistent state with result
  persistentUsers = result.users;
  persistentInteractions = new Map(result.interactions.map(i => [i.id, i]));
  persistentSpatialAnalysis = result.spatialAnalysis;

  return result;
}
