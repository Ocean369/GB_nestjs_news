import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/role/roles.guard';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [NewsController],
  providers: [NewsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
  imports: [
    forwardRef(() => CommentsModule),
    MailModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([NewsEntity])
  ],
  exports: [
    NewsService,
    TypeOrmModule.forFeature([NewsEntity])
  ]
})
export class NewsModule { }
