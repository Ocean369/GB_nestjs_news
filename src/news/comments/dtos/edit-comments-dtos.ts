import { IsString, IsNumber, ValidateIf, IsNotEmpty, IsArray } from 'class-validator';
import { Reply } from '../comments.service';

export class EditCommentDto {
    @IsString()
    @ValidateIf((o) => o.message)
    message: string;

    @IsArray()
    @ValidateIf((o) => o.reply)
    reply: Reply[];

}