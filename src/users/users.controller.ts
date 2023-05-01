import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dtos';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { UsersEntity } from './users.entity';

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
        @UploadedFile() avatar: Express.Multer.File,): Promise<UsersEntity | Error> {
        try {
            if (avatar?.filename) {
                user.avatar = PATH_NEWS + '/' + avatar.filename;
            }
            return await this.usersService.create(user);
        } catch (error) {
            return new Error(`err: ${error}`);
        }

    }
}
