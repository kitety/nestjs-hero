import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import User from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  @Transform(({ value }) => {
    if (value !== null) {
      return value;
    }
  })
  public category?: string;

  @ManyToOne(() => User, (author: User) => author.posts, { eager: false })
  public author: User;

  @ManyToMany(() => Category, (category) => category.posts, {
    cascade: true,
  })
  @JoinTable()
  public categories: Category[];
}

export default Post;
