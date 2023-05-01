import { CommentsEntity } from '../news/comments/comments.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';


@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    firstName: string;

    @Column('text', { nullable: true })
    avatar: string;

    // @Column('text')
    // lastName: string;

    // @Column('text')
    // email: string;

    // @Column('text')
    // role: string;

    @OneToMany(() => NewsEntity, (news) => news.user)
    news: NewsEntity[];

    @OneToMany(() => CommentsEntity, (comments) => comments.user)
    comments: CommentsEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}