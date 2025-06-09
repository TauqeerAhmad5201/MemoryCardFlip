import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum DifficultyLevel {
  EASY = 'easy',      // 4x4 grid
  MEDIUM = 'medium',  // 6x6 grid
  HARD = 'hard'       // 8x8 grid
}

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.EASY
  })
  difficulty: DifficultyLevel;

  @Column()
  score: number;

  @Column()
  timeSeconds: number;

  @Column()
  moves: number;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
