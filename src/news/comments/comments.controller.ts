import { Body, Controller, Param, Post, Get, Delete, Put, Res, UseInterceptors, UploadedFile, Render, ParseIntPipe, UseGuards, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
// import { Comment, CommentDto } from './comments.service'
import { Response } from 'express'
import { EditCommentDto } from './dtos/edit-comments-dtos';
import { CreateCommentDto } from './dtos/create-comments-dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../../utils/HelperFileLoader';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';


const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService,
        private readonly newsService: NewsService,

    ) { }

    @Get('create/comment/:idNews/:idComm?')
    @Render('create-comments')
    async createComment(
        @Param('idNews') idNews: string,
        @Param('idComm') idComm: string) {
        if (idComm) return { idNews: idNews, idComm: idComm }
        else return { idNews: idNews }
    }

    @Get('edit/comment/:idNews/:idComm')
    @Render('edit-comment')
    async editComment(
        @Param('idNews', ParseIntPipe) idNews: number,
        @Param('idComm', ParseIntPipe) idComm: number,
    ) {
        const comment = await this.commentsService.findById(idComm)
        return { idNews: idNews, comment }

    }



    @Post('/api/:idNews/:idComm?')
    @UseGuards(JwtAuthGuard)
    async create(
        @Param('idNews', ParseIntPipe) idNews: number,
        @Body() comment: CreateCommentDto,
        @Req() req,
        @Param('idComm') idComm?: string): Promise<CommentsEntity | Error> {
        try {
            if (idComm) {
                const idCommInt = parseInt(idComm);
            }
            const jwtUserId = await req.user.userId;
            const newComment = await this.commentsService.create(idNews, comment.message, jwtUserId);
            return newComment
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Get('all')
    async get(@Query('idNews', ParseIntPipe) idNews: number) {
        const news = await this.newsService.findById(idNews);
        const comments = await this.commentsService.findAll(idNews)
        return comments
    }

    @Delete('api/:idComm')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.User, Role.Admin)
    async remove(
        @Param('idComm', ParseIntPipe) idComm: number,
        @Req() req): Promise<string | Error> {
        try {

            const jwtUserId = await req.user.userId;
            const jwtUserRole = await req.user.userRoles;
            const _comment = await this.commentsService.findById(idComm);

            if (!_comment) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Передан неверный идентификатор, удаление невозможно.'
                },
                    HttpStatus.NOT_FOUND
                )
            }

            const commentIdUser = _comment.user.id;

            if ((jwtUserRole === 'user' && commentIdUser === jwtUserId) || jwtUserRole === 'admin') {
                const resultRemoving = await this.commentsService.remove(idComm)
                return 'Комментарий удален!'
            }
            return 'Удаление невозможно'
        } catch (error) {
            throw new Error(`err: ${error}`);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('api/:idComm')
    async update(
        @Param('idComm', ParseIntPipe) idComm: number,
        @Body() message: EditCommentDto,
        @Res() response: Response,
        @Req() req) {
        try {
            const _comment = await this.commentsService.findById(idComm);
            const jwtUserId = await req.user.userId;
            console.log('message', message.message, typeof message.message);
            if (!_comment) {
                response.status(404).end('Передан неверный идентификатор. Комментарий не найден')
            } else {
                const result = await this.commentsService.update(idComm, message.message);
                if (result instanceof Error) {
                    response.status(500).end(result.message)
                }
                result
                    ? response.status(200).end('Комментарий успешно изменен')
                    : response.status(400).end('Произвести изменения невозможно.')
            }

        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }


}
