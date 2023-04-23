import { Controller, Get, Param, Post, Body, Delete, Res, UseInterceptors, UploadedFile, Render } from '@nestjs/common';
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
import { MailService } from 'src/mail/mail.service';

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
        private readonly commentsService: CommentsService,
        private readonly mailService: MailService) { }

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
    @Render('news-list')
    getAllView() {
        const news = this.newsService.getAll();
        console.log(news)
        // return renderTemplate(renderNewsAll(news), {
        //     title: 'Список новостей',
        //     description: 'Самые крутые новости на свете!'
        // });
        return { news, title: 'Список новостей' }
    }

    @Get('/:idNews/detail')
    @Render('news-id')
    getNewsWithCommentsView(@Param('idNews') idNews: string) {
        let idNewsInt = parseInt(idNews)
        const news = this.newsService.find(idNewsInt)
        const comments = this.commentsService.find(idNewsInt)
        // return renderTemplate(renderNewsPagewithComment(news, comments))
        return { news, comments }
    }

    @Get('create/news')
    @Render('create-news')
    async createNews() {
        return {}
    }

    @Get('edit/news/:idNews')
    @Render('edit-news')
    async editNews(@Param('idNews') idNews: string) {
        let idNewsInt = parseInt(idNews);
        const news = this.newsService.find(idNewsInt);
        return { news }
    }


    @Post('api')
    @UseInterceptors(FileInterceptor('cover',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    async create(
        @Body() news: CreateNewsDto,
        @UploadedFile() cover: Express.Multer.File
    ): Promise<News> {

        if (cover?.filename) {
            news.cover = PATH_NEWS + '/' + cover.filename;
        }

        const newNews = this.newsService.create(news);
        await this.mailService.sendNewNewsForAdmin(['bogdanan@tut.by,ledix369@gmail.com'], newNews);
        return newNews
    }

    @Delete('api/:id')
    remove(@Param('id') id: string): string {
        let idInt = parseInt(id)
        const isRemoved = this.newsService.remove(idInt)
        return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
    }

    @Post('api/:id')
    @UseInterceptors(FileInterceptor('cover',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    async update(
        @Param('id') id: string,
        @Body() newsDto: EditNewsDto,
        @UploadedFile() cover: Express.Multer.File,
        @Res() response: Response) {
        let idInt = parseInt(id);

        if (cover?.filename) {
            newsDto.cover = PATH_NEWS + '/' + cover.filename;
        }

        const news = this.newsService.find(idInt)
        if (!news) {
            response.status(400).json({ message: 'Передан неверный идентификатор.Произвести изменения невозможно.' });
        }
        if (isEmptyNews(newsDto)) {
            response.status(400).json({ message: 'Не обнаруженно данных, в теле запроса.Произвести изменения невозможно.' });
        }
        const edit = { ...newsDto }
        console.log('look', edit);
        await this.mailService.sendEditNewsForAdmin(['ledix369@gmail.com'], newsDto, news)
        response.status(200).json({ message: this.newsService.update(idInt, newsDto) });

    }
}

