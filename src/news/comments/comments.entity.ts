import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';


@Entity('comments')
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    message: string;

    @ManyToOne(() => UsersEntity, (user) => user.comments, { eager: true })
    user: UsersEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => NewsEntity, (news) => news.comments, { eager: true })
    news: NewsEntity;
}