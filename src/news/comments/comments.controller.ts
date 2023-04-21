import { Body, Controller, Param, Post, Get, Delete, Put, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment, CommentDto } from './comments.service'
import { Response } from 'express'
import { renderTemplate } from '../../views/template';
import { renderCommentsAll } from 'src/views/comments/comments-all';
import { EditCommentDto } from './dtos/edit-comments-dtos';
import { CreateCommentDto } from './dtos/create-comments-dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../../utils/HelperFileLoader';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('/api/:idNews/:idComm?')
    @UseInterceptors(FileInterceptor('photo',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    create(
        @Param('idNews') idNews: string,
        @Body() comment: CreateCommentDto,
        @UploadedFile() photo: Express.Multer.File,
        @Param('idComm') idComm: string) {
        const idNewsInt = parseInt(idNews);
        const idCommInt = parseInt(idComm);

        if (photo?.filename) {
            comment.photo = PATH_NEWS + '/' + photo.filename;
        }

        if (idComm) {
            return this.commentsService.create(idNewsInt, comment, idCommInt)
        }
        else { return this.commentsService.create(idNewsInt, comment) }
    }

    @Get('api/:idNews')
    get(@Param('idNews') idNews: string) {
        const idNewsInt = parseInt(idNews);
        return this.commentsService.find(idNewsInt)
    }

    @Delete('api/:idNews/:idComm')
    remove(@Param('idNews') idNews: string, @Param('idComm') idComm: string) {
        const idNewsInt = parseInt(idNews);
        const idCommInt = parseInt(idComm);
        const resultRemoving = this.commentsService.remove(idNewsInt, idCommInt)
        return resultRemoving ? 'Комментарий удален!' : "Передан неверный идентификатор, удаление невозможно."
    }

    @Put('api/:idNews/:idComm')
    update(@Param('idNews') idNews: string,
        @Param('idComm') idComm: string,
        @Body() commentDto: EditCommentDto,
        @Res() response: Response) {
        const idNewsInt = parseInt(idNews);
        const idCommInt = parseInt(idComm);
        const result = this.commentsService.update(idNewsInt, idCommInt, commentDto);
        return result ? response.status(200).end(result)
            : response.status(400).end('Передан неверный идентификатор.Произвести изменения невозможно.')
    }

}
