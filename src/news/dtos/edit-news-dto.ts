import { IsString, IsNumber, ValidateIf, IsNotEmpty } from 'class-validator';

export class EditNewsDto {
    @IsString()
    @ValidateIf((o) => o.title)
    title: string;

    @IsString()
    @ValidateIf((o) => o.description)
    description: string;

    @IsString()
    @ValidateIf((o) => o.author)
    author: string;

    @IsNumber()
    @ValidateIf((o) => o.countView || o.countView === '')
    countView: number;

    @ValidateIf((o) => o.cover)
    cover: string;
}