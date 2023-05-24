import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments/comments.service';
import { Response } from 'express';
import { MockResponse } from 'mock-express-response';
import { NewsEntity } from './news.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/role/roles.guard';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NewsModule } from './news.module';
import { CommentsModule } from './comments/comments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: NewsService;

  beforeEach(async () => {

    newsService = new NewsService(null, null, null);
    newsController = new NewsController(newsService, null, null);

  });

  describe('findAll', () => {
    it('should return an array of news', async () => {

      const result: NewsEntity[] = [ // Обновление типа результата на NewsEntity[]
        {
          id: 1,
          title: 'Test News',
          description: 'This is a test news article',
          cover: 'https://example.com/cover.jpg',
          user: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        },
      ];

      jest.spyOn(newsService, 'getAll').mockResolvedValue(result);
      expect(await newsController.getAll()).toBe(result);
    });
  });
});
