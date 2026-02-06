# Discord Sims Visualizer

A 3D visualization of Discord server activity using LangGraph patterns, Three.js frontend, and Node.js backend.

## Features

- **Discord Event Collection**: Tracks messages, typing, voice state changes, presence updates, reactions
- **LangGraph State Machine**: 6-node pipeline for intelligent event processing
- **LLM-Powered Classification**: Uses local llama.cpp to classify user activities
- **3D Visualization**: Three.js house with 9 rooms showing user activity
- **Real-time Updates**: WebSocket bridge between backend and frontend
- **Activity Logging**: Comprehensive logging panel for debugging

## Architecture

### Backend (Node.js/TypeScript)
- Discord bot using discord.js
- LangGraph state machine with nodes:
  - `ingest`: Consume raw Discord events
  - `classify`: Use Llama to classify user activity
  - `map_location`: Determine which room user should be in
  - `calculate_animation`: Determine what animation to play
  - `detect_interactions`: Find who's near whom
  - `broadcast`: Send state to frontend via WebSocket
- Llama.cpp integration at localhost:1234
- WebSocket server for frontend communication

### Frontend (Three.js + React)
- 3D house model with 9 distinct rooms
- User avatars with Discord profile pictures
- Smooth position interpolation and animations
- Speech bubbles and action icons
- Activity log panel for debugging
- OrbitControls for camera navigation

## Room Mapping

- **living_room**: Voice chat, socializing
- **game_room**: Gaming (from rich presence)
- **kitchen**: Eating, cooking
- **library**: Reading, studying, working
- **media_room**: Watching videos
- **music_room**: Listening to music
- **garden**: Outside, walking
- **bedroom**: Sleeping, AFK
- **entrance**: New joins, exits

## Development

### Prerequisites
- Node.js 18+
- llama.cpp server running at localhost:1234
- Discord bot token

### Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Environment Variables

**Backend (.env):**
```
DISCORD_TOKEN=your_discord_token_here
LLAMA_ENDPOINT=http://localhost:1234
WS_PORT=8000
```

## Tech Stack

- **Backend**: Node.js, TypeScript, discord.js, LangGraph.js, ws
- **Frontend**: React, Three.js, Vite
- **LLM**: llama.cpp (local)
- **Communication**: WebSocket

## License

MIT
