
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateNewsDto } from 'src/news/dtos/create-news-dto';
import { News } from 'src/news/news.service';
import { EditNewsDto } from 'src/news/dtos/edit-news-dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendTest() {
        console.log('Отправляется письмо установки');
        return this.mailerService
            .sendMail({
                to: 'ledix369@gmail.com',
                // from: 'akibalka369@yandex.ru',
                subject:
                    'Первое тестовое письмо',
                template: './text',

            })
            .then((res) => {
                console.log('res', res);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }


    async sendNewNewsForAdmin(emails: string[], news: News) {
        console.log('Отправляются письма о новой новости администрации ресурса');

        for (const email of emails) {
            await this.mailerService.sendMail({
                to: email,
                subject: `Создана новая новость ${news.title}`,
                template: './new-news',
                context: news,
            })
                .then((res) => {
                    console.log('res', res);
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }

    async sendEditNewsForAdmin(emails: string[], editNews: EditNewsDto, oldNews: News) {
        console.log('Отправляются письма о новой новости администрации ресурса');

        for (const email of emails) {
            await this.mailerService.sendMail({
                to: email,
                subject: `Новость ${oldNews.title} отредактирована`,
                template: './edit-news',
                context: {
                    edit: { ...editNews },
                    old: { ...oldNews }
                },
            })
                .then((res) => {
                    console.log('res', res);
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }

}