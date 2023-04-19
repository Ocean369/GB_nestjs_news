import { Injectable } from '@nestjs/common';
import { Comment } from './comments/comments.service';

export interface News {
    id?: number;
    title: string;
    description: string;
    author: string;
    countView?: number;
    comments?: Comment[];
    cover?: string;
}

export interface NewsDto {
    title?: string;
    description?: string;
    author?: string;
}

export function getRandomInt(min: number = 1, max: number = 99999): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

@Injectable()
export class NewsService {
    private readonly news: News[] = [{
        id: 1,
        title: 'News #1',
        description: 'Hooray! Our first news!',
        author: 'Anastasia',
        countView: 2,
        cover: 'https://natworld.info/wp-content/uploads/2018/02/Vremja-goda-vesna.jpeg'
    }];

    create(news: News): News {
        const id = getRandomInt(0, 99999);
        const finallyNews = {
            ...news,
            id: id
        }
        this.news.push(finallyNews);
        return finallyNews
    }

    find(id: News['id']): News | undefined {
        return this.news.find((news: News) => {
            return news.id === id
        })
    }

    getAll(): News[] {
        return this.news
    }

    remove(id: News['id']): boolean {
        const indexRemoveNews = this.news.findIndex((news: News) => news.id === id)
        let isRemoved = false
        if (indexRemoveNews !== -1) {
            const newNewsArray = this.news.splice(indexRemoveNews, 1)
            if (newNewsArray.length > 0) {
                isRemoved = true
            }
        }
        return isRemoved
    }

    update(id: News['id'], news: NewsDto | undefined): string {
        let findNews = this.find(id)
        let indexUpdateNews = this.news.findIndex((news: News) => news.id === id)
        this.news[indexUpdateNews] = {
            ...findNews,
            ...news
        }
        return 'Новость успешно изменена'
    }

}
