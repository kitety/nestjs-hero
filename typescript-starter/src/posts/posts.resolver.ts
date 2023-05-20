import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { UsersService } from '../users/users.service';
import PostsLoaders from './loaders/posts.loaders';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postService: PostsService,
    private usersService: UsersService,
    private postsLoaders: PostsLoaders,
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
    return this.postService.createPost(createInputPost, context.req.user);
  }

  // 这是一种方法，还可以在数据库查询的时候关联表实现
  // @ResolveField('author', () => User)
  // async getAuthor(@Parent() post: Post) {
  //   const { authorId } = post;
  //   return this.postsLoaders.batchUsers.load(authorId);
  //   return this.usersService.getById(authorId);
  // }
}
