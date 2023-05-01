import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dtos';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
    ) { }

    async create(user: CreateUserDto): Promise<UsersEntity> {
        const usersEntity = new UsersEntity();
        usersEntity.firstName = user.firstName;
        usersEntity.avatar = user.avatar;
        return await this.usersRepository.save(user);
    }

    async findById(id: number): Promise<UsersEntity> {
        return await this.usersRepository.findOneBy({ id });
    }

}


