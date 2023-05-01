import { IsNotEmpty, IsString, ValidateIf, IsArray, IsNumber } from 'class-validator';
import { Reply } from '../comments.service';

export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsArray()
    @ValidateIf((o) => o.reply)
    reply: Reply[];

    // @ValidateIf((o) => o.avatar)
    // avatar: string;
}