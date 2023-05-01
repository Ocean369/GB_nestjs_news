import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ValidateIf((o) => o.avatar)
    avatar: string;
}