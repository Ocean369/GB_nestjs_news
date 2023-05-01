import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    forwardRef(() => CommentsModule),
    MailModule,
    UsersModule,
    TypeOrmModule.forFeature([NewsEntity])
  ],
  exports: [
    NewsService,
    TypeOrmModule.forFeature([NewsEntity])
  ]
})
export class NewsModule { }
