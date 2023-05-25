
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersEntity } from '../users/users.entity';
import { hash } from '../utils/crypto';
import { Role } from '../auth/role/role.enum';
import { Request, Response } from 'express';
import { UsersModule } from '../users/users.module';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        authService = new AuthService(null, null);
        authController = new AuthController(authService);

    });

    describe('login', () => {
        it('should return access token and set cookies', async () => {
            const user: UsersEntity = {
                id: 1,
                email: 'test@example.com',
                password: await hash('password'), // Assuming you're using bcrypt for password hashing
                firstName: 'Alex',
                comments: null,
                news: null,
                avatar: 'url/example.png',
                roles: Role.User,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const req: Request = {
                user: user,
                body: {
                    username: 'test@example.com',
                    password: 'password'
                },
            } as any; // Приведение типа к any

            const res: Response = {
                cookie: jest.fn(),
            } as any; // Приведение типа к any


            // console.log(req.body); // Проверка значения req.body
            // console.log(req.body.user); // Проверка значения req.body.user

            const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue({
                access_token: 'access_token',
                idUser: '1',
            });

            const result = await authController.login(req, res);

            expect(loginSpy).toHaveBeenCalledWith(req.user);
            expect(res.cookie).toHaveBeenCalledWith('jwt', 'access_token', {
                expires: expect.any(Date),
                httpOnly: true,
            });
            expect(res.cookie).toHaveBeenCalledWith('idUser', '1', {
                expires: expect.any(Date),
            });
            expect(result).toBe('access_token');
        });
    });
});
