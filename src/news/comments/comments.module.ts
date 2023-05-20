import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
import { NewsService } from '../news.service';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  controllers: [CommentsController],
  providers: [CommentsService, SocketCommentsGateway, JwtAuthGuard, WsJwtGuard],
  exports: [
    CommentsService,
    TypeOrmModule.forFeature([CommentsEntity])
  ],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    UsersModule,
    AuthModule,
    forwardRef(() => NewsModule),
  ],

})
export class CommentsModule { }
