import { Body, Controller, Param, Post, Get, Delete, Put, Res, UseInterceptors, UploadedFile, Render, ParseIntPipe } from '@nestjs/common';
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
    async create(
        @Param('idNews', ParseIntPipe) idNews: number,
        @Body() comment: CreateCommentDto,
        @Param('idComm') idComm?: string): Promise<CommentsEntity | Error> {
        console.log('we are here. we are creating comment!')
        console.log('commentcreate', comment);
        try {
            if (idComm) {
                const idCommInt = parseInt(idComm);
            }
            const newComment = await this.commentsService.create(idNews, comment);
            return newComment
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Get('api/:idNews')
    // @Render('comment-list')
    async get(@Param('idNews', ParseIntPipe) idNews: number) {
        const news = await this.newsService.findById(idNews);
        console.log('**** news ****', news)
        const comments = await this.commentsService.findAll(idNews)
        console.log('comments', comments)
        return { idNews: idNews, news, comments }
    }

    @Delete('api/:idComm')
    async remove(@Param('idComm', ParseIntPipe) idComm: number): Promise<string | Error> {
        try {
            const resultRemoving = await this.commentsService.remove(idComm)
            return resultRemoving ? 'Комментарий удален!' : "Передан неверный идентификатор, удаление невозможно."
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Put('api/:idComm')
    async update(
        @Param('idComm', ParseIntPipe) idComm: number,
        @Body() commentDto: EditCommentDto,
        @Res() response: Response) {
        try {
            const comment = await this.commentsService.findById(idComm);
            console.log(comment)
            if (!comment) {
                response.status(404).end('Передан неверный идентификатор. Комментарий не найден')
            } else {
                const result = await this.commentsService.update(idComm, commentDto);
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
