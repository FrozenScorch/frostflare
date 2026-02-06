/**
 * LangGraph State Machine for Discord Sims Visualizer
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
} from "./nodes/index.js";

/**
 * Create the Discord Sims visualizer state graph
 */
export function createDiscordSimsGraph() {
  // Create the state graph with StateAnnotation
  const workflow = new StateGraph(StateAnnotation);

  // Add nodes
  workflow.addNode("ingest", ingestNode);
  workflow.addNode("classify", classifyNode);
  workflow.addNode("map_location", mapLocationNode);
  workflow.addNode("interactions", interactionsNode);
  workflow.addNode("animation", animationNode);
  workflow.addNode("broadcast", broadcastNode);

  // Set entry point and add edges with type assertions for LangGraph compatibility
  (workflow as any).setEntryPoint("ingest");
  (workflow as any).addEdge("ingest", "classify");
  (workflow as any).addEdge("classify", "map_location");
  (workflow as any).addEdge("map_location", "interactions");
  (workflow as any).addEdge("interactions", "animation");
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

/**
 * Run the graph with events
 */
export async function processEvents(events: any[]) {
  const graph = getGraph();

  const initialState = {
    users: new Map(),
    events: events,
    interactions: [],
    timestamp: new Date(),
    processedCount: 0,
  };

  const result = await graph.invoke(initialState);

  return result;
}
