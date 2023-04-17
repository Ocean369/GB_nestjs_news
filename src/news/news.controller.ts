import { Controller, Get, Param, Post, Body, Delete, Res } from '@nestjs/common';
import { NewsService, News, NewsDto } from './news.service';
import { Response } from 'express'
import { CommentsService } from './comments/comments.service';
import { renderTemplate } from '../views/template';
import { renderNewsAll } from '../views/news/news-all';
import { renderNewsPagewithComment } from '../views/news/news-id';

function isEmptyNews(news: NewsDto): Boolean {
    if (news['author'] === undefined && news['description'] === undefined && news['title'] === undefined) { return true; }
    return false
}

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService,
        private readonly commentsService: CommentsService) { }

    @Get('/api/details/:id')
    get(@Param('id') id: string): News {
        let idInt = parseInt(id)
        const news = this.newsService.find(idInt)
        const comments = this.commentsService.find(idInt)
        return {
            ...news,
            comments: comments
        }
    }

    @Get('api/all')
    getAll(@Res() response: Response) {
        const news = this.newsService.getAll();
        if (news.length === 0) {
            response.status(200).json([]);
        } else {
            response.status(200).json(news);
        }
    }

    @Get('/all')
    getAllView(): string {
        const news = this.newsService.getAll();

        return renderTemplate(renderNewsAll(news), {
            title: 'Список новостей',
            description: 'Самые крутые новости на свете!'
        });
    }

    @Get('/:idNews/detail')
    getNewsWithCommentsView(@Param('idNews') idNews: string): string {
        console.log('*** info about news ***')
        console.log('idNews', idNews);
        let idNewsInt = parseInt(idNews)
        const news = this.newsService.find(idNewsInt)
        console.log('news', news)
        const comments = this.commentsService.find(idNewsInt)
        console.log('comment', comments)
        return renderTemplate(renderNewsPagewithComment(news, comments))
    }

    @Post()
    create(@Body() news: News): News {
        return this.newsService.create(news)
    }

    @Delete('api/:id')
    remove(@Param('id') id: string): string {
        let idInt = parseInt(id)
        const isRemoved = this.newsService.remove(idInt)
        return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    }

    @Post('api/:id')
    update(@Param('id') id: string, @Body() newsDto: NewsDto, @Res() response: Response) {
        let idInt = parseInt(id);
        const news = this.newsService.find(idInt)
        if (!news) {
            response.status(400).json({ message: 'Передан неверный идентификатор.Произвести изменения невозможно.' });
        }
        if (isEmptyNews(newsDto)) {
            response.status(400).json({ message: 'Не обнаруженно данных, в теле запроса.Произвести изменения невозможно.' });
        }
        response.status(200).json({ message: this.newsService.update(idInt, newsDto) });

    }
}
