import { IsString, IsNumber, ValidateIf, IsNotEmpty, IsArray } from 'class-validator';
import { Reply } from '../comments.service';

export class EditCommentDto {
    @IsString()
    @ValidateIf((o) => o.message)
    message: string;

    @IsString()
    @ValidateIf((o) => o.author)
    author: string;

    @IsArray()
    @ValidateIf((o) => o.reply)
    reply: Reply[];

    @ValidateIf((o) => o.photo)
    photo: string;
}