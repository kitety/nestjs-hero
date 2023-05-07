import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import User from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
// @Index(['postId', 'authorId'])
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  // @Column()
  // public content: string;

  @Column({ nullable: true })
  @Transform(({ value }) => {
    if (value !== null) {
      return value;
    }
  })
  public category?: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts, { eager: false })
  public author: User;

  @ManyToMany(() => Category, (category) => category.posts, {
    cascade: true,
  })
  @JoinTable()
  public categories: Category[];

  @Column('text', { array: true })
  public paragraphs: string[];

  @OneToMany(() => Comment, (comment) => comment.post)
  public comments: Comment[];

  @CreateDateColumn()
  createdDate: Date;
}

export default Post;
