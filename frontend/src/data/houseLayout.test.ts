import assert from "node:assert/strict";
import test from "node:test";
import { createDemoSnapshot } from "./demo";
import {
  HOUSE_ROOMS,
  buildRooms,
  getEastExteriorWallSegments,
  getVoiceRoomId,
  userBelongsInRoom,
} from "./houseLayout";
import { getActivityPresentation } from "./activityPresentation";

test("the ground floor is a complete contiguous 3x3 plan", () => {
  assert.equal(HOUSE_ROOMS.length, 9);
  assert.deepEqual(
    new Set(HOUSE_ROOMS.map((room) => room.position.x)),
    new Set([-10, 0, 10]),
  );
  assert.deepEqual(
    new Set(HOUSE_ROOMS.map((room) => room.position.z)),
    new Set([-10, 0, 10]),
  );
  assert.equal(HOUSE_ROOMS.find((room) => room.id === "entrance")?.position.z, 10);
});

test("demo activities occupy their matching rooms", () => {
  const users = createDemoSnapshot().users;
  const expectedRooms: Record<string, string> = {
    gaming: "game_room",
    listening: "music_room",
    watching: "media_room",
    reading: "library",
  };

  Object.entries(expectedRooms).forEach(([action, room]) => {
    const user = users.find((candidate) => candidate.action === action);
    assert.equal(user?.currentRoom, room);
    assert.notEqual(user && getActivityPresentation(user).label, "Online");
  });
});

test("voice rooms use the channel name, canonical id, and attached wing", () => {
  const users = createDemoSnapshot().users;
  const rooms = buildRooms(users);
  const voiceUser = users.find((user) => user.voiceChannelId);
  assert.ok(voiceUser?.voiceChannelId);

  const roomId = getVoiceRoomId(voiceUser.voiceChannelId);
  const voiceRoom = rooms.find((room) => room.id === roomId);
  assert.ok(voiceRoom);
  assert.equal(voiceRoom?.name, voiceUser.voiceChannelName);
  assert.equal(voiceRoom?.position.x, 20);
  assert.equal(userBelongsInRoom(voiceUser, roomId), true);

  const staleActivityRoomUser = { ...voiceUser, currentRoom: "living_room" };
  assert.equal(userBelongsInRoom(staleActivityRoomUser, "living_room"), false);
  assert.equal(userBelongsInRoom(staleActivityRoomUser, roomId), true);

  assert.deepEqual(getEastExteriorWallSegments([voiceRoom]), [
    { centerZ: -10, length: 10 },
    { centerZ: 10, length: 10 },
  ]);
});
