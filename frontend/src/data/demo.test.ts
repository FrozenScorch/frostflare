import assert from "node:assert/strict";
import test from "node:test";
import { createDemoSnapshot } from "./demo";

test("demo snapshots satisfy the public state contract and evolve", () => {
  const first = createDemoSnapshot(0);
  const second = createDemoSnapshot(1);

  assert.equal(first.guilds.length, 1);
  assert.equal(first.users.length, 5);
  assert.equal(first.stats.totalUsers, first.users.length);
  assert.equal(first.stats.activeUsers, first.users.length);
  assert.equal(first.interactions.length, 1);
  assert.equal(second.stats.processedEvents, first.stats.processedEvents + 1);

  for (const user of first.users) {
    assert.equal(user.guildId, first.guilds[0].id);
    assert.match(user.avatar, /^data:image\/svg\+xml,/);
    assert.equal(Number.isNaN(Date.parse(user.lastActivity)), false);
    assert.equal(typeof user.position.x, "number");
    assert.equal(typeof user.targetPosition.z, "number");
  }

  const voiceUser = first.users.find((user) => user.voiceChannelId);
  assert.ok(voiceUser);
  assert.equal(voiceUser.currentRoom, voiceUser.voiceChannelId);
});
