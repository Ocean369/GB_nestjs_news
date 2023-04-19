// import { IsNotEmpty, IsString, ValidateIf, IsNumber, IsNumberString } from 'class-validator';

// export class CreateNewsDto {
//     @IsNotEmpty()
//     @IsString()
//     title: string;

//     @IsNotEmpty()
//     @IsString()
//     description: string;

//     @IsNotEmpty()
//     @IsString()
//     author: string;

//     @IsNumberString()
//     @ValidateIf((o) => o.countView || o.countView === '')
//     countView: number;

//     @ValidateIf((o) => o.cover)
//     cover: string;
// }