
// import { MailController } from './mail.controller';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://akibalka369@gmail.com:SJxC0HpvuM@smtp.gmail.com',
      // ipgjuljgvcrrottw
      // B5iesNUQeP8uxmH
      // transport: 'smtps://akibalka369@yandex.ru:ipgjuljgvcrrottw@smtp.yandex.ru',
      // pass  TStYFr21rat(
      transport: 'smtps://akibalka369@mail.ru:zLwTK4b9TSgMmtqTbVaE@smtp.mail.ru',

      defaults: {
        from: '"nest-modules" <akibalka369@mail.ru>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
