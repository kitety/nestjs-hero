import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FindOneParams } from '../utils/findOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { PaginationParams } from '../utils/types/paginationParams';
import { DEFAULT_OFFSET, DEFAULT_PAGE_SIZE } from './constants';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import { HttpCacheInterceptor } from './httpCache.interceptor';
import JwtTwoFactorGuard from '../authentication/jwt-two-factor.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  // exception 3
  // @UseFilters(ExceptionsLoggerFilter)
  // getPostById(@Param('id') id: string) {
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }

  @Get()
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @UseInterceptors(HttpCacheInterceptor)
  async getPosts(
    @Query('search') search: string,
    @Query()
    {
      offset = DEFAULT_OFFSET,
      limit = DEFAULT_PAGE_SIZE,
      startId,
    }: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }
    return this.postsService.getAllPosts(offset, limit, startId);
  }
}
