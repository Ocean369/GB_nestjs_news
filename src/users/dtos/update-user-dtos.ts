import { IsNotEmpty, IsString, ValidateIf, IsEnum } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    email: string;


    @IsString()
    password: string;

    @ValidateIf((o) => o.avatar)
    avatar: string;
}