import { IsNotEmpty, IsString, ValidateIf, IsEnum } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @ValidateIf((o) => o.firstname)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @ValidateIf((o) => o.email)
    email: string;


    @IsString()
    @ValidateIf((o) => o.password)
    password: string;

    @ValidateIf((o) => o.avatar)
    avatar: string;
}