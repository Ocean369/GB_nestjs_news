import { CommentsController } from "./comments.controller";
import { CommentsEntity } from "./comments.entity";
import { CommentsService } from "./comments.service";
import { Repository } from 'typeorm';
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";

describe('CommentsController', () => {
    let commentsController: CommentsController;
    let commentsService: CommentsService;

    beforeEach(async () => {
        //const commentsRepository = new Repository<CommentsEntity>();
        commentsService = new CommentsService(null, null, null, null);
        commentsController = new CommentsController(commentsService, null);
    });

    describe('Create', () => {
        it('should create a comment for an authorized user', async () => {
            const commentData = {
                id: 1,
                message: 'Hello everyone! It is great news!',
                user: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                news: null
            };

            jest.spyOn(commentsService, 'create').mockResolvedValue(commentData);

            // Mock the request object with an authenticated user
            const req = {
                user: {
                    userId: 123, // Assuming the user ID is 123
                },
            };

            const createdComment = await commentsController.create(1, { message: 'Hello everyone! It is great news!' }, req);

            expect(createdComment).toBe(commentData);
            expect(commentsService.create).toHaveBeenCalledWith(1, 'Hello everyone! It is great news!', 123);
        });

        it('should return an error for an unauthorized user', async () => {
            const req = {
                user: undefined,
            };

            const forbiddenError = new ForbiddenException('Forbidden.');
            jest.spyOn(commentsService, 'create').mockRejectedValue(forbiddenError);

            await expect(commentsController.create(1, { message: 'Hello everyone! It is great news!' }, req)).rejects.toThrow(forbiddenError);
            expect(commentsService.create).not.toHaveBeenCalled();
        });
    });
});
