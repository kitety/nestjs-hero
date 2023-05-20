import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';
import PostsSearchService from './postsSearch.service';
import { SearchModule } from '../search/search.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from '../users/users.module';
import PostsLoaders from './loaders/posts.loaders';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService, PostsResolver, PostsLoaders],
  exports: [PostsService],
})
export class PostsModule {}
