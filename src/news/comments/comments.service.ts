import { Injectable } from '@nestjs/common';
import { getRandomInt } from '../news.service'
export type Comment = {
    id?: number;
    message: string;
    author: string;
    reply?: Reply[];
    photo?: string;
}

export type CommentDto = {
    message?: string;
    author?: string;
}

export type Reply = {
    id?: number;
    message: string;
    author: string;
}

@Injectable()
export class CommentsService {
    private readonly comments = {}

    create(idNews: number, comment: Comment, idComm?: number): Comment {
        if (!idComm) {
            if (!this.comments[idNews]) {
                this.comments[idNews] = []
            }
            const id = getRandomInt()
            this.comments[idNews].push({ ...comment, id: id })
            return { ...comment, id: id }
        } else {
            if (this.comments[idNews]) {
                const indexAnsweredComm = this.comments[idNews].findIndex((comment: Comment) => comment.id === idComm)
                if (indexAnsweredComm !== -1) {
                    let reply = this.comments[idNews][indexAnsweredComm].reply;
                    if (!reply) {
                        reply = []
                    }
                    const id = getRandomInt()
                    reply.push({ ...comment, id: id });

                    this.comments[idNews][indexAnsweredComm] = {
                        ...this.comments[idNews][indexAnsweredComm],
                        reply: reply
                    }
                    return {
                        ...this.comments[idNews][indexAnsweredComm],
                        reply: reply
                    }
                }
            }
        }
    }

    find(idNews: number): Comment[] | undefined {
        return this.comments[idNews] || undefined
    }

    remove(idNews: number, idComm: number): Boolean {
        const indexDeletedComm = this.comments[idNews].findIndex((comment: Comment) => comment.id === idComm)
        let isRemoved = false
        if (indexDeletedComm !== -1) {
            const commArray = this.comments[idNews].splice(indexDeletedComm, 1)
            if (commArray.length > 0) {
                isRemoved = true
            }
        }
        return isRemoved
    }

    update(idNews: number, idComm: number, commentDto: CommentDto): string | undefined {
        if (!this.comments[idNews]) {
            return undefined
        }
        const indexUpdateComm = this.comments[idNews].findIndex((comment: Comment) => comment.id === idComm)
        if (indexUpdateComm === -1) {
            return undefined
        }
        // console.log(commentDto, idNews, idComm);
        this.comments[idNews][indexUpdateComm] = {
            ...this.comments[idNews][indexUpdateComm],
            ...commentDto
        }
        return 'Комментарий успешно изменен'

    }
}
