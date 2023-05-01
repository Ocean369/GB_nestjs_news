import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { NewsService } from '../news.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { CreateCommentDto } from './dtos/create-comments-dtos';
import { UsersService } from 'src/users/users.service';
import { EditCommentDto } from './dtos/edit-comments-dtos';
import { NewsEntity } from '../news.entity';

export type Reply = {
    id?: number;
    message: string;
    author: string;
}

@Injectable()
export class CommentsService {
    private readonly comments = {}

    constructor(
        @InjectRepository(CommentsEntity)
        private commentsRepository: Repository<CommentsEntity>,
        private userService: UsersService,
        @Inject(forwardRef(() => NewsService))
        private newsService: NewsService,
    ) { }

    async create(idNews: number, comment: CreateCommentDto, idComm?: number): Promise<CommentsEntity | Error> {
        try {
            const commentsEntity = new CommentsEntity;
            commentsEntity.message = comment.message;
            const _user = await this.userService.findById(parseInt(comment.userId));
            commentsEntity.user = _user;
            const _news = await this.newsService.findById(idNews);
            commentsEntity.news = _news;
            return await this.commentsRepository.save(commentsEntity);
        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }

        // }
        // if (this.comments[idNews]) {
        //     const indexAnsweredComm = this.comments[idNews].findIndex((comment: Comment) => comment.id === idComm)
        //     if (indexAnsweredComm !== -1) {
        //         let reply = this.comments[idNews][indexAnsweredComm].reply;
        //         if (!reply) {
        //             reply = []
        //         }
        //         const id = getRandomInt()
        //         reply.push({ ...comment, id: id });

        //         this.comments[idNews][indexAnsweredComm] = {
        //             ...this.comments[idNews][indexAnsweredComm],
        //             reply: reply
        //         }
        //         return {
        //             ...this.comments[idNews][indexAnsweredComm],
        //             reply: reply
        //         }
        //     }
        // }
        // }
    }

    async findById(id: number): Promise<CommentsEntity | null | Error> {
        try {
            return await this.commentsRepository.findOneBy({ id })

        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }
    }

    async findAll(newsId: number): Promise<CommentsEntity[] | null | Error> {
        try {
            return await this.commentsRepository.find({
                relations: ["news", "user"],
                where: { news: { id: newsId } },
            });
        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }
    }

    async remove(id: number): Promise<Boolean | Error> {
        try {
            const removingComment = await this.findById(id);
            if (removingComment) {
                await this.commentsRepository.delete(id);
                return true
            }
            return false
        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }
    }

    async removeAllForIdNews(comments: CommentsEntity[]): Promise<Boolean | Error> {
        try {
            await this.commentsRepository.remove(comments);
            return true
        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }

    }

    async update(id: number, comment: EditCommentDto): Promise<boolean | Error> {
        try {
            let findComment = await this.findById(id);
            if (findComment) {
                const commentsEntity = new CommentsEntity;
                commentsEntity.message = comment.message || commentsEntity.message;
                await this.commentsRepository.update(id, commentsEntity)
                return true
            }
            return false

        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }
    }
}
