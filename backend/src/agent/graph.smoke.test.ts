import assert from "node:assert/strict";
import test from "node:test";
import { setWsBroadcast } from "./nodes/broadcast.js";
import { processEvents, resetPersistentState } from "./graph.js";
import { getRelationshipTracker } from "../services/relationship_tracker.js";

test("a synthetic Discord event traverses the graph and produces wire state", async () => {
  process.env.LLAMA_ENDPOINT = "http://127.0.0.1:1";
  resetPersistentState();

  let broadcast: any;
  setWsBroadcast((message) => {
    broadcast = message;
  });

  try {
    const result = await processEvents([
      {
        id: "smoke-presence-1",
        type: "presence_update",
        userId: "smoke-user",
        timestamp: new Date(),
        data: {
          guildId: "smoke-guild",
          username: "smoke-user",
          displayName: "Smoke User",
          avatar: "",
          status: "online",
          activities: [],
          clientStatus: { desktop: "online" },
          inVoiceChannel: true,
          voiceChannelId: "smoke-lounge",
          voiceChannelName: "Smoke Lounge",
        },
      },
    ]);

    assert.equal(result.users.has("smoke-user"), true);
    assert.equal(broadcast.type, "state_update");
    assert.equal(broadcast.users.length, 1);
    assert.equal(broadcast.users[0].id, "smoke-user");
    assert.equal(broadcast.users[0].guildId, "smoke-guild");
    assert.equal(broadcast.users[0].voiceChannelId, "smoke-lounge");
    assert.equal(broadcast.users[0].voiceChannelName, "Smoke Lounge");
    assert.equal(broadcast.users[0].targetPosition.x, 20);
    assert.match(broadcast.timestamp, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    setWsBroadcast(() => undefined);
    getRelationshipTracker().destroy();
    resetPersistentState();
  }
});
