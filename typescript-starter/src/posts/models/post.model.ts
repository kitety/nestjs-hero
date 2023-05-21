import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.module';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  authorId: number;

  @Field(() => User)
  author: User;

  @Field(() => String)
  title: string;

  @Field(() => [String])
  paragraphs: string[];
  @Field()
  createdDate: Date;

  @Field({ nullable: true })
  scheduledDate?: Date;
}
