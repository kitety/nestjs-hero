import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PostEntity from '../posts/post.entity';
import User from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  public post: PostEntity;

  @ManyToOne(() => User, (user) => user.comments)
  public author: User;

  @CreateDateColumn()
  createdDate: Date;
}
