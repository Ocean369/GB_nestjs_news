import { Controller, Get, Param, Post, Body, Delete, Res } from '@nestjs/common';
import { NewsService, News, NewsDto } from './news.service';
import { Response } from 'express'

function isEmptyNews(news: NewsDto): Boolean {
    if (news['author'] === undefined && news['description'] === undefined && news['title'] === undefined) { return true; }
    return false
}

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    // @Get('/:id')
    // get(@Param('id') id: string): News {
    //     let idInt = parseInt(id)
    //     return this.newsService.find(idInt)
    // }

    @Get('all')
    getAll(@Res() response: Response) {
        const news = this.newsService.getAll();
        if (news.length === 0) {
            response.status(200).json([]);
        } else {
            response.status(200).json(news);
        }
    }

    @Post()
    create(@Body() news: News): News {
        return this.newsService.create(news)
    }

    @Delete('/:id')
    remove(@Param('id') id: string): string {
        let idInt = parseInt(id)
        const isRemoved = this.newsService.remove(idInt)
        return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    }

    @Post('/:id')
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
