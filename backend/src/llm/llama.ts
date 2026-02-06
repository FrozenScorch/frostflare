/**
 * Llama.cpp integration for local LLM inference
 */

export interface LlamaResponse {
  content: string;
  model: string;
  tokens_predicted: number;
  tokens_evaluated: number;
}

export interface ClassificationResult {
  activityType: string;
  room: string;
  action: string;
  mood: string;
  reasoning: string;
}

export interface InteractionResult {
  userIds: string[];
  type: string;
  confidence: number;
  reasoning: string;
}

export class LlamaClient {
  private endpoint: string;

  constructor(endpoint: string = "http://localhost:1234") {
    this.endpoint = endpoint;
  }

  /**
   * Send completion request to llama.cpp
   */
  async complete(
    prompt: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      stop?: string[];
    } = {}
  ): Promise<string> {
    const {
      maxTokens = 256,
      temperature = 0.7,
      topP = 0.95,
      stop = [],
    } = options;

    try {
      const response = await fetch(`${this.endpoint}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // llama.cpp typically accepts this
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature,
          top_p: topP,
          stop,
        }),
      });

      if (!response.ok) {
        throw new Error(`Llama API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling llama.cpp:", error);
      throw error;
    }
  }

  /**
   * Classify user activity
   */
  async classifyActivity(
    eventType: string,
    userActivity: string,
    richPresence: string,
    inVoiceChannel: boolean,
    isTyping: boolean,
    lastMessage: string
  ): Promise<ClassificationResult> {
    const prompt = `
You are an activity classifier. Respond ONLY with valid JSON.

Event Type: ${eventType}
User Activity: ${userActivity}
Rich Presence: ${richPresence}
In Voice Channel: ${inVoiceChannel}
Is Typing: ${isTyping}
Last Message: ${lastMessage || "none"}

Classify this into JSON:
{
  "activityType": "chatting|gaming|voice_chat|listening_music|watching_video|working|studying|eating|sleeping|afk|typing",
  "room": "living_room|game_room|kitchen|library|media_room|music_room|garden|bedroom|entrance",
  "action": "idle|walking|talking|gaming|eating|reading|watching|listening|sleeping|typing",
  "mood": "happy|neutral|sad|excited|focused|bored",
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.complete(prompt, {
        maxTokens: 256,
        temperature: 0.3,
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const result = JSON.parse(jsonMatch[0]) as ClassificationResult;
      return result;
    } catch (error) {
      console.error("Error classifying activity:", error);
      // Return default classification
      return {
        activityType: "unknown",
        room: "living_room",
        action: "idle",
        mood: "neutral",
        reasoning: "Default classification due to error",
      };
    }
  }

  /**
   * Detect social interactions between users
   */
  async detectInteractions(
    users: Array<{
      userId: string;
      username: string;
      currentRoom: string;
      recentMessages: string[];
      activity: string;
    }>
  ): Promise<InteractionResult[]> {
    if (users.length < 2) {
      return [];
    }

    const prompt = `
You are a social interaction detector. Respond ONLY with valid JSON array.

Users:
${users
  .map(
    (u) => `
- ${u.username} (${u.userId})
  Room: ${u.currentRoom}
  Activity: ${u.activity}
  Recent Messages: ${u.recentMessages.slice(0, 3).join(", ") || "none"}
`
  )
  .join("\n")}

Detect social interactions. Respond with JSON array:
[
  {
    "userIds": ["id1", "id2"],
    "type": "conversation|gaming_together|watching_together",
    "confidence": 0.0-1.0,
    "reasoning": "explanation"
  }
]

Return [] if no interactions.`;

    try {
      const response = await this.complete(prompt, {
        maxTokens: 512,
        temperature: 0.5,
      });

      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const result = JSON.parse(jsonMatch[0]) as InteractionResult[];
      return result;
    } catch (error) {
      console.error("Error detecting interactions:", error);
      return [];
    }
  }

  /**
   * Determine appropriate animation
   */
  async getAnimation(
    action: string,
    mood: string,
    _activityType: string,
    isMoving: boolean
  ): Promise<string> {
    // Simple rule-based animation selection
    // Can be enhanced with LLM calls if needed
    if (isMoving) return "walk";
    if (action === "sleeping") return "sleep";
    if (action === "talking" || action === "typing") return "talk";
    if (mood === "excited" || mood === "happy") return "gesture";

    return "idle";
  }

  /**
   * Check if llama.cpp server is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let llamaClient: LlamaClient | null = null;

export function getLlamaClient(): LlamaClient {
  if (!llamaClient) {
    const endpoint = process.env.LLAMA_ENDPOINT || "http://localhost:1234";
    llamaClient = new LlamaClient(endpoint);
  }
  return llamaClient;
}
