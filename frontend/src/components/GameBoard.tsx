'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, Trophy, Zap } from 'lucide-react';
import { GameState, DifficultyLevel, Card, User, GameSession } from '../types';
import { generateCards, getDifficultyConfig, calculateScore, formatTime } from '../lib/gameUtils';
import { gameAPI } from '../lib/api';
import GameCard from './GameCard';

interface GameBoardProps {
  user: User;
  difficulty: DifficultyLevel;
  onGameComplete: (score: number, timeSeconds: number, moves: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ user, difficulty, onGameComplete }) => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timeSeconds: 0,
    gameStarted: false,
    gameCompleted: false,
    difficulty,
    score: 0
  });

  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const config = getDifficultyConfig(difficulty);

  // Initialize game
  const initializeGame = useCallback(() => {
    const cards = generateCards(difficulty);
    setGameState({
      cards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      timeSeconds: 0,
      gameStarted: false,
      gameCompleted: false,
      difficulty,
      score: 0
    });
    setGameSession(null);
  }, [difficulty]);

  // Start game and create session
  const startGame = useCallback(async () => {
    if (!gameState.gameStarted && !gameSession) {
      try {
        const session = await gameAPI.createSession({
          userId: user.id,
          difficulty
        });
        setGameSession(session);
        setGameState(prev => ({ ...prev, gameStarted: true }));
      } catch (error) {
        console.error('Failed to create game session:', error);
      }
    }
  }, [gameState.gameStarted, gameSession, user.id, difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gameStarted && !gameState.gameCompleted) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeSeconds: prev.timeSeconds + 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gameStarted, gameState.gameCompleted]);

  // Handle card click
  const handleCardClick = useCallback(async (cardId: number) => {
    if (isProcessing || gameState.gameCompleted) return;

    // Start game on first click
    if (!gameState.gameStarted) {
      await startGame();
    }

    setGameState(prev => {
      const newFlippedCards = [...prev.flippedCards];
      
      // If this card is already flipped, ignore
      if (newFlippedCards.includes(cardId)) return prev;
      
      // If we already have 2 cards flipped, ignore
      if (newFlippedCards.length >= 2) return prev;

      // Add this card to flipped cards
      newFlippedCards.push(cardId);
      
      // Update cards state
      const newCards = prev.cards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      );

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: newFlippedCards.length === 2 ? prev.moves + 1 : prev.moves
      };
    });
  }, [isProcessing, gameState.gameCompleted, gameState.gameStarted, startGame]);

  // Check for matches when 2 cards are flipped
  useEffect(() => {
    if (gameState.flippedCards.length === 2) {
      setIsProcessing(true);
      
      const [firstId, secondId] = gameState.flippedCards;
      const firstCard = gameState.cards.find(c => c.id === firstId);
      const secondCard = gameState.cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isMatched: true }
                : card
            ),
            flippedCards: [],
            matchedPairs: prev.matchedPairs + 1
          }));
          setIsProcessing(false);
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, isFlipped: false }
                : card
            ),
            flippedCards: []
          }));
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [gameState.flippedCards, gameState.cards]);

  // Check for game completion
  useEffect(() => {
    if (gameState.matchedPairs === config.totalPairs && !gameState.gameCompleted) {
      const finalScore = calculateScore(gameState.timeSeconds, gameState.moves, difficulty);
      
      setGameState(prev => ({
        ...prev,
        gameCompleted: true,
        score: finalScore
      }));

      // Update game session
      if (gameSession) {
        gameAPI.updateSession(gameSession.id, {
          score: finalScore,
          timeSeconds: gameState.timeSeconds,
          moves: gameState.moves,
          completed: true
        }).catch(console.error);
      }

      onGameComplete(finalScore, gameState.timeSeconds, gameState.moves);
    }
  }, [gameState.matchedPairs, config.totalPairs, gameState.gameCompleted, gameState.timeSeconds, gameState.moves, difficulty, gameSession, onGameComplete]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-xl font-bold">{formatTime(gameState.timeSeconds)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Moves</div>
              <div className="text-xl font-bold">{gameState.moves}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="text-sm text-gray-600">Pairs</div>
              <div className="text-xl font-bold">{gameState.matchedPairs}/{config.totalPairs}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-xl font-bold">{gameState.score}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className={`
          grid gap-3 bg-white rounded-xl shadow-lg p-6
          grid-cols-${config.gridSize}
        `}
        style={{ 
          gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
          aspectRatio: '1'
        }}
      >
        <AnimatePresence>
          {gameState.cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: card.id * 0.05 }}
            >
              <GameCard
                card={card}
                onClick={handleCardClick}
                disabled={isProcessing || gameState.flippedCards.length >= 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      <div className="mt-6 text-center">
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5 inline mr-2" />
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
