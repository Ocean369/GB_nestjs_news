import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Redirect, Render, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { UsersEntity } from './users.entity';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { UpdateUserDto } from './dtos/update-user-dtos';

const helperFileLoader = new HelperFileLoader();
const PATH_NEWS = '/news_static';
helperFileLoader.path = PATH_NEWS;

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('api')
    @UseInterceptors(FileInterceptor('avatar',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    async create(
        @Body() user: CreateUserDto,
        @UploadedFile() avatar: Express.Multer.File,): Promise<Object | Error> {
        try {
            if (avatar?.filename) {
                user.avatar = PATH_NEWS + '/' + avatar.filename;
            }
            console.log(user);
            return await this.usersService.create(user);
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }

    @Get('profile')
    @Render('profile')
    async profileView(
        @Query('idUser') idUser: string) {

        const idUserInt = parseInt(idUser);

        try {
            const user = await this.usersService.findById(idUserInt);
            return { user }
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Roles(Role.User)
    @Put('api/edit/:idUser')
    @UseInterceptors(FileInterceptor('avatar',
        {
            storage: diskStorage({
                destination: helperFileLoader.destinationPath,
                filename: helperFileLoader.customFileName,
            }),
            fileFilter: helperFileLoader.fileFilter
        }),
    )
    async update(
        @Param('idUser', ParseIntPipe) idUser: number,
        @Body() user: UpdateUserDto,
        @UploadedFile() avatar: Express.Multer.File,): Promise<boolean | Error> {
        try {
            if (avatar?.filename) {
                user.avatar = PATH_NEWS + '/' + avatar.filename;
            }
            return await this.usersService.edit(idUser, user);
        } catch (error) {
            return new Error(`err: ${error}`);
        }
    }
}
