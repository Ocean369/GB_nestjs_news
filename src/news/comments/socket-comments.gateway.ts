import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { OnEvent } from '@nestjs/event-emitter'
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';

export type Comment = { message: string; idNews: number };

@WebSocketGateway()
export class SocketCommentsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    // создали сервер
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    constructor(private readonly commentsService: CommentsService) { }
    @UseGuards(WsJwtGuard)
    // подписались на сообщения клиентов с типом 'addComment'
    @SubscribeMessage('addComment')
    async handleMessage(client: Socket, comment: Comment) {
        const { idNews, message } = comment;
        const userId: number = client.data.user.id;
        const _comment = await this.commentsService.create(idNews, message, userId);
        this.server.to(idNews.toString()).emit('newComment', _comment);
    }

    @SubscribeMessage('editComment')
    async handleEditMessage(payload) {
        const { commentId, newsId } = payload;
        window.location.href = `/comments/edit/comment/${newsId}/${commentId}`
        // const { idNews, message } = comment;
        // const userId: number = client.data.user.id;
        // const _comment = await this.commentsService.create(idNews, message, userId);
        this.server.to(newsId.toString()).emit('editComment', {});
    }

    @OnEvent('comment.remove')
    handleRemoveCommentEvent(payload) {
        const { commentId, newsId } = payload;
        this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
    }

    @OnEvent('comment.edit')
    handleEditCommentEvent(payload) {
        const { commentId, newsId, message } = payload;
        this.server.to(newsId.toString()).emit('editComment', { id: commentId, message: message });
    }



    // событие срабатывает после инициализации сервера
    afterInit(server: Server) {
        this.logger.log('Init');
    }
    // событие срабатывает после каждого отключения клиента
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    // событие срабатывает после каждого подключения клиента
    handleConnection(client: Socket, ...args: any[]) {
        const { newsId } = client.handshake.query;
        client.join(newsId);
        this.logger.log(`Client connected: ${client.id}`);
    }
}