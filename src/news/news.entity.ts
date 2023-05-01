import { UsersEntity } from '../users/users.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { CommentsEntity } from './comments/comments.entity';


@Entity('news')
export class NewsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('text', { nullable: true })
    cover: string;

    // @ManyToOne(() => CategoriesEntity, (category) => category.news)
    // category: CategoriesEntity;

    @ManyToOne(() => UsersEntity, (user) => user.news, { eager: true })
    user: UsersEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => CommentsEntity, (comments) => comments.news)
    comments: CommentsEntity[]
}


