export interface User {
  id: number;
  username: string;
  totalGamesPlayed: number;
  totalScore: number;
  bestScore: number;
  createdAt: string;
}

export interface GameSession {
  id: number;
  user: User;
  difficulty: DifficultyLevel;
  score: number;
  timeSeconds: number;
  moves: number;
  completed: boolean;
  createdAt: string;
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  timeSeconds: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  difficulty: DifficultyLevel;
  score: number;
}

export interface CreateUserRequest {
  username: string;
}

export interface CreateGameSessionRequest {
  userId: number;
  difficulty: DifficultyLevel;
}

export interface UpdateGameSessionRequest {
  score: number;
  timeSeconds: number;
  moves: number;
  completed: boolean;
}
