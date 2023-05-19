import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postService: PostsService) {}

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
}
