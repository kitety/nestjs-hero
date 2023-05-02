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
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { FindOneParams } from '../utils/findOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';

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
  @UseGuards(JwtAuthenticationGuard)
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
  async getPosts(@Query('search') search: string) {
    if (search) {
      return this.postsService.searchForPosts(search);
    }
    return this.postsService.getAllPosts();
  }
}
