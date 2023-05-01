import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../news/news.entity';
import { UsersEntity } from './users.entity';
import { CommentsModule } from 'src/news/comments/comments.module';

@Module({

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService,
    TypeOrmModule.forFeature([UsersEntity])],
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
  ],
})
export class UsersModule { }
