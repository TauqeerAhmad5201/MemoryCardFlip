import { IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DifficultyLevel } from '../entities/game-session.entity';

export class CreateGameSessionDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  @Min(1)
  userId: number;

  @ApiProperty({ enum: DifficultyLevel, description: 'Game difficulty level' })
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;
}

export class UpdateGameSessionDto {
  @ApiProperty({ description: 'Final score achieved', example: 1500 })
  @IsNumber()
  @Min(0)
  score: number;

  @ApiProperty({ description: 'Time taken in seconds', example: 45 })
  @IsNumber()
  @Min(1)
  timeSeconds: number;

  @ApiProperty({ description: 'Number of moves made', example: 20 })
  @IsNumber()
  @Min(0)
  moves: number;

  @ApiProperty({ description: 'Whether the game was completed', example: true })
  @IsBoolean()
  completed: boolean;
}
