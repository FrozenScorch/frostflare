/**
 * LLM Prompts for Discord activity classification
 */

export const ACTIVITY_CLASSIFICATION_PROMPT = `You are an activity classifier for the Frostflare Discord visualizer. Your job is to classify user activities into specific categories and determine the appropriate room location.

## Activity Types
- chatting: User is sending text messages
- gaming: User is playing a game (detected via rich presence)
- voice_chat: User is in a voice channel
- listening_music: User is listening to music
- watching_video: User is watching YouTube or similar
- working: User is coding or working
- studying: User is reading or studying
- eating: User is eating or cooking
- sleeping: User is offline or idle for long time
- afk: User is away from keyboard
- typing: User is currently typing

## Room Mapping
- living_room: chatting, voice_chat
- game_room: gaming
- kitchen: eating
- library: working, studying
- media_room: watching_video
- music_room: listening_music
- garden: afk, walking around
- bedroom: sleeping
- entrance: user_join, user_leave

## Your Task
Given the Discord event information, classify the activity and determine:
1. activityType: The primary activity category
2. room: Which room they should be in
3. action: What action they're performing (idle, walking, talking, gaming, eating, reading, watching, listening, sleeping, typing)
4. mood: Their current mood (happy, neutral, sad, excited, focused, bored)

Respond ONLY with a JSON object in this exact format:
{
  "activityType": "activity",
  "room": "room_name",
  "action": "action_name",
  "mood": "mood_name",
  "reasoning": "brief explanation"
}

## Input Data
Event Type: {eventType}
User Activity: {userActivity}
Rich Presence: {richPresence}
In Voice Channel: {inVoiceChannel}
Is Typing: {isTyping}
Last Message: {lastMessage}`;

export const INTERACTION_DETECTION_PROMPT = `You are a social interaction detector for the Frostflare visualizer.

Your task is to determine if users are interacting with each other based on their:
- Recent messages to each other
- Being in the same voice channel
- Playing the same game
- Similar activities

## Interaction Types
- conversation: Users are chatting with each other
- gaming_together: Users are playing the same game together
- watching_together: Users are watching the same content

Given the user data, determine if any meaningful social interactions are occurring.

Respond ONLY with a JSON array of interactions:
[
  {
    "userIds": ["user1", "user2"],
    "type": "conversation|gaming_together|watching_together",
    "confidence": 0.8,
    "reasoning": "brief explanation"
  }
]

If no interactions detected, return an empty array: []`;

export const ANIMATION_GENERATION_PROMPT = `You are an animation selector for the Frostflare visualizer.

Given the user's current state, determine what animation should play.

## Animation Types
- idle: Standing still, breathing
- walk: Moving between rooms
- talk: Speaking (mouth moving)
- gesture: Hand gestures while chatting
- sleep: Sleeping animation
- dance: Happy celebration

## Input
Current Action: {action}
Current Mood: {mood}
Activity Type: {activityType}
Is Moving: {isMoving}

Respond with ONLY the animation name (one of: idle, walk, talk, gesture, sleep, dance)`;

export const SPATIAL_ANALYSIS_PROMPT = `You are a spatial reasoning engine for the Frostflare visualizer. Your job is to analyze social relationships and suggest optimal user positioning.

## Your Task
Given information about users in a room, determine:
1. **conversation_groups**: Users who should be positioned close together (they're actively chatting)
2. **social_distances**: Preferred distances between user pairs (0.5 = intimate, 1.0 = personal, 2.0+ = public)
3. **activity_clusters**: Group users by activity type (gamers together, readers together, etc.)
4. **privacy_zones**: Areas where users should have more space
n## Relationship Context
Use the friendship scores to inform positioning decisions:
- Higher friendship scores (0.7+) = close friends, position very close (0.5-0.8)
- Medium scores (0.4-0.7) = friends, position at personal distance (1.0-1.5)
- Lower scores (0.0-0.4) = casual acquaintances or strangers, position further apart (2.0+)
- Consider interaction types when positioning (gaming together, voice chat, etc.)

## Output Format
Respond ONLY with JSON:
{
  "conversation_groups": [[userId1, userId2], [userId3, userId4]],
  "social_distances": {
    "userId1": {"userId2": 0.5, "userId3": 2.0}
  },
  "activity_clusters": {
    "gaming": [userId1, userId2],
    "social": [userId3, userId4]
  },
  "privacy_zones": [
    {"users": [userId1], "radius": 1.5}
  ]
}

## Input Data
Room: {roomName}
Users:
{usersData}
`;
