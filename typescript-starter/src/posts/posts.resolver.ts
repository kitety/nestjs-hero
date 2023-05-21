import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { Inject, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { PUB_SUB } from '../pubSub/pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postService: PostsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postService.getAllPosts();
    return posts.results;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createInputPost: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const newPost = await this.postService.createPost(
      createInputPost,
      context.req.user,
    );
    await this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }

  // 这是一种方法，还可以在数据库查询的时候关联表实现
  // @ResolveField('author', () => User)
  // async getAuthor(@Parent() post: Post) {
  //   const { authorId } = post;
  //   return this.postsLoaders.batchUsers.load(authorId);
  //   return this.usersService.getById(authorId);
  // }

  @Subscription(() => Post, {
    // filter: (payload, variables) => {
    //   return payload.postAdded.title === 'Hello world!';
    // },
    // resolve: (value) => {
    //   return {
    //     ...value.postAdded,
    //     title: `Title: ${value.postAdded.title}`,
    //   };
    // },
  })
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
