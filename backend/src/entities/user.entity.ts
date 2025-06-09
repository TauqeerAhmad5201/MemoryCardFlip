import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: 0 })
  totalGamesPlayed: number;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  bestScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
