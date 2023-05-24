import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersEntity } from '../users/users.entity';
import { hash } from '../utils/crypto';
import { Role } from '../auth/role/role.enum';
import { Request, Response } from 'express';
import { UsersModule } from '../users/users.module';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {

        usersService = new UsersService(null);
        jwtService = new JwtService();
        authService = new AuthService(usersService, jwtService);
    });

    describe('validateUser', () => {
        it('should return user if valid email and password are provided', async () => {
            const email = 'test@example.com';
            const pass = 'password';
            const loginData: UsersEntity = {
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
            }

            const findByEmailSpy = jest.spyOn(usersService, 'findByEmail').mockResolvedValue(loginData);

            const result = await authService.validateUser(email, pass);

            expect(findByEmailSpy).toHaveBeenCalledWith(email);
            const { password, ...validateUserRes } = loginData
            expect(result).toEqual(validateUserRes);
        });

        it('should return null if invalid email or password is provided', async () => {
            const email = 'test@example.com';
            const password = 'password';

            const findByEmailSpy = jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

            const result = await authService.validateUser(email, password);

            expect(findByEmailSpy).toHaveBeenCalledWith(email);
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token and user ID', async () => {
            const user = {
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

            const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('access_token' as any);

            const result = await authService.login(user);

            expect(signSpy).toHaveBeenCalledWith({ email: user.firstName, id: user.id });
            expect(result).toEqual({
                access_token: 'access_token',
                idUser: user.id,
            });
        });
    });

    describe('verify', () => {
        it('should verify the token', async () => {
            const token = 'access_token';

            const verifySpy = jest.spyOn(jwtService, 'verify').mockReturnValue('decoded_token' as any);

            const result = await authService.verify(token);

            expect(verifySpy).toHaveBeenCalledWith(token);
            expect(result).toBe('decoded_token');
        });
    });

    describe('decode', () => {
        it('should decode the token', async () => {
            const token = 'access_token';

            const decodeSpy = jest.spyOn(jwtService, 'decode').mockReturnValue('decoded_token' as any);

            const result = await authService.decode(token);

            expect(decodeSpy).toHaveBeenCalledWith(token);
            expect(result).toBe('decoded_token');
        });
    });
});