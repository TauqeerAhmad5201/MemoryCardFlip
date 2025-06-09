import { Card, DifficultyLevel } from '../types';

// Card symbols for the memory game
const CARD_SYMBOLS = [
  '🎮', '🎯', '🎪', '🎨', '🎭', '🎵', '🎸', '🎹',
  '🎲', '🎳', '🃏', '🎰', '🎊', '🎈', '🎁', '🎂',
  '🎄', '🎃', '🎀', '🎗️', '🏆', '🏅', '🥇', '🥈',
  '⭐', '🌟', '💎', '💫', '🔥', '⚡', '🌈', '🦄'
];

export const getDifficultyConfig = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return { gridSize: 4, totalPairs: 8 };
    case DifficultyLevel.MEDIUM:
      return { gridSize: 6, totalPairs: 18 };
    case DifficultyLevel.HARD:
      return { gridSize: 8, totalPairs: 32 };
    default:
      return { gridSize: 4, totalPairs: 8 };
  }
};

export const generateCards = (difficulty: DifficultyLevel): Card[] => {
  const config = getDifficultyConfig(difficulty);
  const selectedSymbols = CARD_SYMBOLS.slice(0, config.totalPairs);
  
  // Create pairs of cards
  const cardPairs = selectedSymbols.flatMap((symbol, index) => [
    { id: index * 2, value: symbol, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, value: symbol, isFlipped: false, isMatched: false }
  ]);

  // Shuffle the cards
  return shuffleArray(cardPairs);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateScore = (timeSeconds: number, moves: number, difficulty: DifficultyLevel): number => {
  const difficultyMultiplier = {
    [DifficultyLevel.EASY]: 100,
    [DifficultyLevel.MEDIUM]: 200,
    [DifficultyLevel.HARD]: 300
  };

  const baseScore = difficultyMultiplier[difficulty];
  const timeBonus = Math.max(0, baseScore - (timeSeconds * 2));
  const config = getDifficultyConfig(difficulty);
  const perfectMoves = config.totalPairs;
  const movesPenalty = Math.max(0, (moves - perfectMoves) * 5);
  
  return Math.max(0, Math.round(baseScore + timeBonus - movesPenalty));
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return 'Easy (4×4)';
    case DifficultyLevel.MEDIUM:
      return 'Medium (6×6)';
    case DifficultyLevel.HARD:
      return 'Hard (8×8)';
    default:
      return 'Easy (4×4)';
  }
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DifficultyLevel.EASY:
      return 'text-green-600';
    case DifficultyLevel.MEDIUM:
      return 'text-yellow-600';
    case DifficultyLevel.HARD:
      return 'text-red-600';
    default:
      return 'text-green-600';
  }
};
