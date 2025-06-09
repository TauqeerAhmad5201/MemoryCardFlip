import { Controller, Get, Post, Put, Body, Param, Query, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GameSessionService } from '../services/game-session.service';
import { CreateGameSessionDto, UpdateGameSessionDto } from '../dto/game-session.dto';
import { GameSession, DifficultyLevel } from '../entities/game-session.entity';

@ApiTags('game-sessions')
@Controller('game-sessions')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new game session' })
  @ApiResponse({ status: 201, description: 'Game session created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(@Body(ValidationPipe) createGameSessionDto: CreateGameSessionDto): Promise<GameSession> {
    return this.gameSessionService.create(createGameSessionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game session by ID' })
  @ApiResponse({ status: 200, description: 'Game session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Game session not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GameSession> {
    return this.gameSessionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update game session with final results' })
  @ApiResponse({ status: 200, description: 'Game session updated successfully' })
  @ApiResponse({ status: 404, description: 'Game session not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateGameSessionDto: UpdateGameSessionDto
  ): Promise<GameSession> {
    return this.gameSessionService.update(id, updateGameSessionDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all game sessions for a user' })
  @ApiResponse({ status: 200, description: 'Game sessions retrieved successfully' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<GameSession[]> {
    return this.gameSessionService.findByUser(userId);
  }

  @Get('leaderboard/top-scores')
  @ApiOperation({ summary: 'Get top scores leaderboard' })
  @ApiQuery({ name: 'difficulty', enum: DifficultyLevel, required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Top scores retrieved successfully' })
  async getTopScores(
    @Query('difficulty') difficulty?: DifficultyLevel,
    @Query('limit', ParseIntPipe) limit: number = 10
  ): Promise<GameSession[]> {
    return this.gameSessionService.findTopScores(difficulty, limit);
  }
}
