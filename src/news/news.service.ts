import { Injectable, forwardRef, Inject } from '@nestjs/common';
// import { Comment } from './comments/comments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments/comments.service';

export interface News {
    id?: number;
    title: string;
    description: string;
    // author: string;
    // countView?: number;
    comments?: Comment[];
    cover?: string;
}

export interface NewsDto {
    title?: string;
    description?: string;
    cover?: string
    // author?: string;
}

export function getRandomInt(min: number = 1, max: number = 99999): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private newsRepository: Repository<NewsEntity>,
        private userService: UsersService,
        @Inject(forwardRef(() => CommentsService))
        private commentsService: CommentsService
    ) { }

    async create(news: CreateNewsDto): Promise<NewsEntity> {
        const newsEntity = new NewsEntity();
        newsEntity.title = news.title;
        newsEntity.description = news.description;
        newsEntity.cover = news.cover;
        const _user = await this.userService.findById(parseInt(news.userId));
        newsEntity.user = _user;
        return await this.newsRepository.save(newsEntity);
    }

    async findById(id: News['id']): Promise<NewsEntity | null> {

        return await this.newsRepository.findOneBy({ id })
    }

    async getAll(): Promise<NewsEntity[] | undefined> {
        return await this.newsRepository.find();
    }

    async sortAllByUserId(idUser: number): Promise<NewsEntity[] | undefined> {
        return await this.newsRepository.find({
            relations: ["comments", "user"],
            where: { user: { id: idUser } },
        });
    }

    async remove(id: News['id']): Promise<boolean | Error> {
        try {
            const removingNews = await this.findById(id);
            if (removingNews) {
                const comments = await this.commentsService.findAll(id);
                if (!(comments instanceof Error)) {
                    await this.commentsService.removeAllForIdNews(comments);
                    await this.newsRepository.delete(id);
                    return true
                }
            }
            return false
        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`)
        }
    }

    async update(id: News['id'], news: NewsDto | undefined): Promise<string | Error | null> {

        try {
            let findNews = await this.findById(id);
            if (findNews) {
                const newsEntity = new NewsEntity();
                newsEntity.title = news.title || findNews.title;
                newsEntity.description = news.description || findNews.description;
                newsEntity.cover = news.cover || findNews.cover;
                await this.newsRepository.update(id, newsEntity)
                return 'Новость успешна изменена!'
            }
            return null

        } catch (error) {
            return new Error(`Произошла ошибка: ${error}`);
        }
    }

}
