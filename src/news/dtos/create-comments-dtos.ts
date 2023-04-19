import { IsNotEmpty, IsString, ValidateIf, IsArray } from 'class-validator';
import { Reply } from '../comments/comments.service';

export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsArray()
    @ValidateIf((o) => o.reply)
    reply: Reply[];

    @ValidateIf((o) => o.photo)
    photo: string;
}