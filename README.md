# Memory Card Flip Game

A modern, full-stack memory card matching game built with Next.js and Nest.js.

## Features

### 🎮 Game Features
- **Multiple Difficulty Levels**: Easy (4×4), Medium (6×6), Hard (8×8)
- **Smooth Animations**: Card flip animations using Framer Motion
- **Time-based Scoring**: Get bonus points for completing faster
- **Move Tracking**: Efficiency-based scoring system
- **User Progress**: Track games played, scores, and personal bests

### 🏆 Scoring System
- Base score varies by difficulty level
- Time bonus for faster completion
- Move efficiency penalty for extra moves
- Personal best tracking

### 💫 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Beautiful gradient backgrounds
- Interactive 3D card flip effects

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icons
- **Axios** - HTTP client

### Backend
- **Nest.js** - Scalable Node.js framework
- **TypeScript** - Full type safety
- **TypeORM** - Database ORM
- **SQLite** - Local database
- **Swagger** - API documentation
- **Class Validator** - Input validation

## Project Structure

```
MemoryCardFlip/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and API
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                 # Nest.js backend
│   ├── src/
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── entities/        # Database models
│   │   └── dto/             # Data transfer objects
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MemoryCardFlip
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```
   The API will be available at `http://localhost:3001`
   API documentation at `http://localhost:3001/api`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The game will be available at `http://localhost:3000`

## Game Rules

1. **Objective**: Match all pairs of cards in the shortest time with fewest moves
2. **Gameplay**:
   - Click cards to flip them over
   - Find matching pairs of symbols
   - Cards flip back if they don't match
   - Matched pairs stay visible
3. **Scoring**:
   - Base points for difficulty level
   - Time bonus for speed
   - Move penalty for inefficiency

## API Endpoints

### Users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `GET /users/username/:username` - Get user by username
- `GET /users/leaderboard` - Get top players

### Game Sessions
- `POST /game-sessions` - Start new game
- `PUT /game-sessions/:id` - Update game results
- `GET /game-sessions/:id` - Get game session
- `GET /game-sessions/user/:userId` - Get user's games
- `GET /game-sessions/leaderboard/top-scores` - Get high scores

## Development

### Adding New Features
1. Backend changes in `/backend/src/`
2. Frontend changes in `/frontend/src/`
3. Update types in `/frontend/src/types/`
4. Test both frontend and backend

### Database
- SQLite database auto-created on first run
- Database file: `backend/memory-game.db`
- Schema auto-synced in development

## Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend
- `PORT` - Backend server port (default: 3001)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on the repository or contact the development team.

---

**Enjoy playing the Memory Card Flip Game! 🎮✨**
