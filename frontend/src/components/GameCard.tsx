'use client';

import { motion } from 'framer-motion';
import { Card } from '../types';

interface GameCardProps {
  card: Card;
  onClick: (cardId: number) => void;
  disabled: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ card, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <motion.div
      className={`
        relative w-full aspect-square cursor-pointer select-none
        ${disabled || card.isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      whileHover={!disabled && !card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
      whileTap={!disabled && !card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-white/20">
            <div className="text-white text-2xl font-bold">?</div>
          </div>
        </div>

        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className={`
            w-full h-full rounded-lg shadow-lg flex items-center justify-center border-2 border-white/20
            ${card.isMatched 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-white to-gray-100'
            }
          `}>
            <div className="text-4xl">{card.value}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
