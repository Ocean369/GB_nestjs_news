import { Controller, Get, Param, Post, Body, Delete, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NewsService, News, NewsDto } from './news.service';
import { Response } from 'express'
import { CommentsService } from './comments/comments.service';
import { renderTemplate } from '../views/template';
import { renderNewsAll } from '../views/news/news-all';
import { renderNewsPagewithComment } from '../views/news/news-id';
import { CreateNewsDto } from './dtos/create-news-dto.js';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../utils/HelperFileLoader';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

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
        let idNewsInt = parseInt(idNews)
        const news = this.newsService.find(idNewsInt)
        const comments = this.commentsService.find(idNewsInt)

        return renderTemplate(renderNewsPagewithComment(news, comments))
    }

    @Post()
    @UseInterceptors(FileInterceptor('cover',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    create(
        @Body() news: CreateNewsDto,
        @UploadedFile() cover: Express.Multer.File,
    ): News {

        if (cover?.filename) {
            news.cover = PATH_NEWS + '/' + cover.filename;
        }

        return this.newsService.create(news)
    }

    @Delete('api/:id')
    remove(@Param('id') id: string): string {
        let idInt = parseInt(id)
        const isRemoved = this.newsService.remove(idInt)
        return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    }

    @Post('api/:id')
    update(@Param('id') id: string, @Body() newsDto: EditNewsDto, @Res() response: Response) {
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

