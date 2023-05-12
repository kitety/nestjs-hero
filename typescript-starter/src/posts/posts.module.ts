import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';
import PostsSearchService from './postsSearch.service';
import { SearchModule } from '../search/search.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
