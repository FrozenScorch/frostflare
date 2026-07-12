import assert from "node:assert/strict";
import test from "node:test";
import { getVoiceRoomPosition, ROOM_POSITIONS } from "./map_location.js";

test("backend room centers mirror the frontend ground floor", () => {
  assert.deepEqual(ROOM_POSITIONS.game_room, { x: -10, y: 0, z: -10 });
  assert.deepEqual(ROOM_POSITIONS.living_room, { x: 0, y: 0, z: -10 });
  assert.deepEqual(ROOM_POSITIONS.media_room, { x: 10, y: 0, z: -10 });
  assert.deepEqual(ROOM_POSITIONS.library, { x: -10, y: 0, z: 0 });
  assert.deepEqual(ROOM_POSITIONS.kitchen, { x: 0, y: 0, z: 0 });
  assert.deepEqual(ROOM_POSITIONS.music_room, { x: 10, y: 0, z: 0 });
  assert.deepEqual(ROOM_POSITIONS.garden, { x: -10, y: 0, z: 10 });
  assert.deepEqual(ROOM_POSITIONS.entrance, { x: 0, y: 0, z: 10 });
  assert.deepEqual(ROOM_POSITIONS.bedroom, { x: 10, y: 0, z: 10 });
});

test("voice rooms form a centered attached wing", () => {
  assert.deepEqual(getVoiceRoomPosition(0, 1), { x: 20, y: 0, z: 0 });
  assert.deepEqual(getVoiceRoomPosition(0, 3), { x: 20, y: 0, z: -10 });
  assert.deepEqual(getVoiceRoomPosition(2, 3), { x: 20, y: 0, z: 10 });
});
