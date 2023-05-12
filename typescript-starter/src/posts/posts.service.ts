import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './post.entity';
import { PostNotFundException } from './exception/postNotFund.exception';
import User from '../users/user.entity';
import PostsSearchService from './postsSearch.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postSearchService: PostsSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count({ where });
    }
    const [results, count] = await this.postsRepository.findAndCount({
      where,
      relations: ['author', 'categories', 'comments'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    return {
      results,
      count: startId ? separateCount : count,
    };
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (post) {
      return post;
    }
    throw new PostNotFundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      await this.postSearchService.update(updatedPost);
      await this.clearCache();
      return updatedPost;
    }
    throw new PostNotFundException(id);
  }

  async createPost(post: CreatePostDto, author: User): Promise<Post> {
    const newPost = await this.postsRepository.create({ ...post, author });
    await this.postsRepository.save(newPost);
    await this.postSearchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFundException(id);
    }
    await this.postSearchService.remove(id);
    await this.clearCache();
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results, count } = await this.postSearchService.search(
      text,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      // 数据结构的完善
      return {
        results: [],
        count: 0,
      };
    }
    const items = await this.postsRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['author', 'categories', 'comments'],
    });
    return {
      results: items,
      count,
    };
  }
}
