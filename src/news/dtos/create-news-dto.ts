import { IsNotEmpty, IsString, ValidateIf, IsNumber, IsNumberString } from 'class-validator';

export class CreateNewsDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @ValidateIf((o) => o.cover)
    cover: string;
}