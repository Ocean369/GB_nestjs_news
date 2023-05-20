import {
    Controller, Get, Param, Post, Body, Delete, Res,
    UseInterceptors, UploadedFile, Render, HttpException,
    HttpStatus, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { NewsService, News, NewsDto } from './news.service';
import { Response } from 'express'
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dtos/create-news-dto.js';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { MailService } from 'src/mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';

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
        private readonly mailService: MailService,
        // private readonly usersService: UsersService
    ) { }


    @Get('api/all')
    async getAll(@Res() response: Response): Promise<void> {
        try {
            const news = await this.newsService.getAll();
            if (news.length === 0) {
                response.status(200).json([]);
            } else {
                response.status(200).json(news);
            }
        } catch (error) {
            response.status(400).end(error);
        }

    }

    @Get('/all')
    @Render('news-list')
    async getAllView() {
        try {
            const news = await this.newsService.getAll();
            console.log('news', news)
            return { news, title: 'Список новостей' }
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Get('/all/sort/:idUser')
    @Render('news-list')
    async getAllSort(@Param('idUser', ParseIntPipe) idUser: number) {
        try {
            const news = await this.newsService.sortAllByUserId(idUser);
            console.log('news', news)
            return { news, title: 'Список новостей' }
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }




    @Get('/:idNews/detail')
    @Render('news-id')
    async getNewsWithCommentsView(@Param('idNews', ParseIntPipe) idNews: number) {

        try {
            const news = await this.newsService.findById(idNews)
            // const comments = await this.commentsService.findAll(idNews);

            if (news === null) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Новость не найдена'
                },
                    HttpStatus.NOT_FOUND
                )
            }
            return { news }
        } catch (error) {
            return new Error(`err: ${error}`);
        }

    }

    @Get('create/news')
    @Render('create-news')
    async createNews() {
        return {}
    }

    @Get('edit/news/:idNews')
    @Render('edit-news')
    async editNews(@Param('idNews', ParseIntPipe) idNews: number) {
        try {
            const news = await this.newsService.findById(idNews);

            return { news }
        } catch (error) {
            return new Error(`err: ${error}`);
        }

    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin, Role.Moderator)
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
    ): Promise<NewsEntity | Error> {
        try {
            if (cover?.filename) {
                news.cover = PATH_NEWS + '/' + cover.filename;
            }

            const newNews = await this.newsService.create(news);
            await this.mailService.sendNewNewsForAdmin(['bogdanan@tut.by,ledix369@gmail.com'], newNews);
            return newNews
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Delete('api/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<string | Error> {
        try {
            const isRemoved = this.newsService.remove(id)
            return isRemoved ? 'Новость удалена!' : "Передан неверный идентификатор, удаление невозможно."
        } catch (error) {
            return new Error(`err: ${error}`);
        }

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
        @Param('id', ParseIntPipe) id: number,
        @Body() newsDto: EditNewsDto,
        @UploadedFile() cover: Express.Multer.File,
        @Res() response: Response): Promise<void> {
        try {
            if (cover?.filename) {
                newsDto.cover = PATH_NEWS + '/' + cover.filename;
            }

            const news = await this.newsService.findById(id)
            if (!news) {
                response.status(400).json({ message: 'Передан неверный идентификатор.Произвести изменения невозможно.' });
            }
            if (isEmptyNews(newsDto)) {
                response.status(400).json({ message: 'Не обнаруженно данных, в теле запроса.Произвести изменения невозможно.' });
            }
            await this.mailService.sendEditNewsForAdmin(['ledix369@gmail.com'], newsDto, news)
            response.status(200).json({ message: this.newsService.update(id, newsDto) });

        } catch (error) {
            new Error(`err: ${error}`);
        }
    }

}

