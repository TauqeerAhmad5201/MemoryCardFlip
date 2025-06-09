import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession, DifficultyLevel } from '../entities/game-session.entity';
import { CreateGameSessionDto, UpdateGameSessionDto } from '../dto/game-session.dto';
import { UserService } from './user.service';

@Injectable()
export class GameSessionService {
  constructor(
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
    private userService: UserService,
  ) {}

  async create(createGameSessionDto: CreateGameSessionDto): Promise<GameSession> {
    const user = await this.userService.findOne(createGameSessionDto.userId);
    
    const gameSession = this.gameSessionRepository.create({
      user,
      difficulty: createGameSessionDto.difficulty,
      score: 0,
      timeSeconds: 0,
      moves: 0,
      completed: false
    });

    return this.gameSessionRepository.save(gameSession);
  }

  async findOne(id: number): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id },
      relations: ['user']
    });
    
    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }
    
    return gameSession;
  }

  async update(id: number, updateGameSessionDto: UpdateGameSessionDto): Promise<GameSession> {
    const gameSession = await this.findOne(id);
    
    // Calculate score based on performance
    const finalScore = this.calculateScore(
      updateGameSessionDto.timeSeconds,
      updateGameSessionDto.moves,
      gameSession.difficulty,
      updateGameSessionDto.completed
    );

    Object.assign(gameSession, {
      ...updateGameSessionDto,
      score: finalScore
    });

    const savedSession = await this.gameSessionRepository.save(gameSession);

    // Update user stats if game was completed
    if (updateGameSessionDto.completed) {
      await this.userService.updateStats(gameSession.user.id, finalScore);
    }

    return savedSession;
  }

  async findByUser(userId: number): Promise<GameSession[]> {
    return this.gameSessionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user']
    });
  }

  async findTopScores(difficulty?: DifficultyLevel, limit: number = 10): Promise<GameSession[]> {
    const queryBuilder = this.gameSessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.completed = :completed', { completed: true })
      .orderBy('session.score', 'DESC')
      .take(limit);

    if (difficulty) {
      queryBuilder.andWhere('session.difficulty = :difficulty', { difficulty });
    }

    return queryBuilder.getMany();
  }

  private calculateScore(timeSeconds: number, moves: number, difficulty: DifficultyLevel, completed: boolean): number {
    if (!completed) {
      return 0;
    }

    // Base score depends on difficulty
    const difficultyMultiplier = {
      [DifficultyLevel.EASY]: 100,
      [DifficultyLevel.MEDIUM]: 200,
      [DifficultyLevel.HARD]: 300
    };

    const baseScore = difficultyMultiplier[difficulty];
    
    // Time bonus (faster = higher score)
    const maxTimeBonus = baseScore;
    const timeBonus = Math.max(0, maxTimeBonus - (timeSeconds * 2));
    
    // Efficiency bonus (fewer moves = higher score)
    const perfectMoves = this.getPerfectMoveCount(difficulty);
    const movesPenalty = Math.max(0, (moves - perfectMoves) * 5);
    
    const finalScore = Math.max(0, baseScore + timeBonus - movesPenalty);
    return Math.round(finalScore);
  }

  private getPerfectMoveCount(difficulty: DifficultyLevel): number {
    // Perfect moves = total pairs (since each pair requires 2 moves to match)
    const gridSizes = {
      [DifficultyLevel.EASY]: 16,   // 4x4 = 8 pairs
      [DifficultyLevel.MEDIUM]: 36, // 6x6 = 18 pairs
      [DifficultyLevel.HARD]: 64    // 8x8 = 32 pairs
    };
    
    return gridSizes[difficulty] / 2;
  }
}
