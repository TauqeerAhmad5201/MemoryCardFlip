'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Trophy, Play, Settings } from 'lucide-react';
import { User, DifficultyLevel } from '../types';
import { getDifficultyLabel, getDifficultyColor } from '../lib/gameUtils';
import { userAPI } from '../lib/api';
import GameBoard from '../components/GameBoard';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Try to load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('memoryGameUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('memoryGameUser');
      }
    }
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Try to find existing user first
      try {
        const existingUser = await userAPI.getByUsername(username);
        setCurrentUser(existingUser);
        localStorage.setItem('memoryGameUser', JSON.stringify(existingUser));
      } catch (error) {
        // User doesn't exist, create new one
        const newUser = await userAPI.create({ username: username.trim() });
        setCurrentUser(newUser);
        localStorage.setItem('memoryGameUser', JSON.stringify(newUser));
      }
      
      setUsername('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create/find user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = () => {
    if (currentUser) {
      setGameStarted(true);
    }
  };

  const handleGameComplete = (score: number, timeSeconds: number, moves: number) => {
    // Update user stats locally (will be updated on server via API)
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        totalGamesPlayed: currentUser.totalGamesPlayed + 1,
        totalScore: currentUser.totalScore + score,
        bestScore: Math.max(currentUser.bestScore, score)
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('memoryGameUser', JSON.stringify(updatedUser));
    }
    
    // Return to main menu after a delay
    setTimeout(() => {
      setGameStarted(false);
    }, 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setGameStarted(false);
    localStorage.removeItem('memoryGameUser');
  };

  if (gameStarted && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Memory Card Game</h1>
            <p className="text-gray-600">Playing as {currentUser.username} • {getDifficultyLabel(selectedDifficulty)}</p>
            <button
              onClick={() => setGameStarted(false)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Menu
            </button>
          </div>
          
          <GameBoard
            user={currentUser}
            difficulty={selectedDifficulty}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Memory Card Game
          </h1>
          <p className="text-xl text-gray-600">
            Test your memory with this fun and challenging card matching game!
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          {!currentUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-6">
                <UserIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Join the Game</h2>
                <p className="text-gray-600">Enter your username to start playing</p>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={20}
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !username.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Loading...' : 'Start Playing'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser.username}!</h2>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <div className="text-gray-600">Games Played</div>
                    <div className="text-xl font-bold">{currentUser.totalGamesPlayed}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Best Score</div>
                    <div className="text-xl font-bold">{currentUser.bestScore}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Score</div>
                    <div className="text-xl font-bold">{currentUser.totalScore}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Difficulty: {getDifficultyLabel(selectedDifficulty)}</span>
                </button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {Object.values(DifficultyLevel).map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => {
                            setSelectedDifficulty(difficulty);
                            setShowSettings(false);
                          }}
                          className={`w-full py-2 px-4 rounded-lg text-left transition-colors ${
                            selectedDifficulty === difficulty
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className={getDifficultyColor(difficulty)}>
                            {getDifficultyLabel(difficulty)}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleStartGame}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Game</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Switch User
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
