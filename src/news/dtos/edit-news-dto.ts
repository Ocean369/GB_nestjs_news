import { IsString, IsNumber, ValidateIf, IsNotEmpty } from 'class-validator';

export class EditNewsDto {
    @IsString()
    @ValidateIf((o) => o.title)
    title: string;

    @IsString()
    @ValidateIf((o) => o.description)
    description: string;

    @ValidateIf((o) => o.cover)
    cover: string;
}