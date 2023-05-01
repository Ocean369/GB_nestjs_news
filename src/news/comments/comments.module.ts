import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from '../news.module';
import { NewsService } from '../news.service';

@Module({

  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [
    CommentsService,
    TypeOrmModule.forFeature([CommentsEntity])
  ],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    UsersModule,
    forwardRef(() => NewsModule),
  ],

})
export class CommentsModule { }
