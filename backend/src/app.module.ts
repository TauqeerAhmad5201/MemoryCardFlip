import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { GameSessionController } from './controllers/game-session.controller';
import { UserService } from './services/user.service';
import { GameSessionService } from './services/game-session.service';
import { User } from './entities/user.entity';
import { GameSession } from './entities/game-session.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'memory-game.db',
      entities: [User, GameSession],
      synchronize: true, // Only for development
    }),
    TypeOrmModule.forFeature([User, GameSession]),
  ],
  controllers: [AppController, UserController, GameSessionController],
  providers: [AppService, UserService, GameSessionService],
})
export class AppModule {}
