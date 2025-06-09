import axios from 'axios';
import { User, GameSession, CreateUserRequest, CreateGameSessionRequest, UpdateGameSessionRequest, DifficultyLevel } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getByUsername: async (username: string): Promise<User> => {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },

  getLeaderboard: async (): Promise<User[]> => {
    const response = await api.get('/users/leaderboard');
    return response.data;
  },
};

export const gameAPI = {
  createSession: async (data: CreateGameSessionRequest): Promise<GameSession> => {
    const response = await api.post('/game-sessions', data);
    return response.data;
  },

  updateSession: async (id: number, data: UpdateGameSessionRequest): Promise<GameSession> => {
    const response = await api.put(`/game-sessions/${id}`, data);
    return response.data;
  },

  getSession: async (id: number): Promise<GameSession> => {
    const response = await api.get(`/game-sessions/${id}`);
    return response.data;
  },

  getUserSessions: async (userId: number): Promise<GameSession[]> => {
    const response = await api.get(`/game-sessions/user/${userId}`);
    return response.data;
  },

  getTopScores: async (difficulty?: DifficultyLevel, limit: number = 10): Promise<GameSession[]> => {
    const params = new URLSearchParams();
    if (difficulty) params.append('difficulty', difficulty);
    params.append('limit', limit.toString());
    
    const response = await api.get(`/game-sessions/leaderboard/top-scores?${params}`);
    return response.data;
  },
};

export default api;
