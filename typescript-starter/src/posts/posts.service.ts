import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import Post from './post.entity';
import { PostNotFundException } from './exception/postNotFund.exception';
import User from '../users/user.entity';
import PostsSearchService from './postsSearch.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postSearchService: PostsSearchService,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author', 'categories'] });
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
      return updatedPost;
    }
    throw new PostNotFundException(id);
  }

  async createPost(post: CreatePostDto, author: User): Promise<Post> {
    const newPost = await this.postsRepository.create({ ...post, author });
    await this.postsRepository.save(newPost);
    await this.postSearchService.indexPost(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFundException(id);
    }
    await this.postSearchService.remove(id);
  }

  async searchForPosts(text: string) {
    const results = await this.postSearchService.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['author', 'categories'],
    });
  }
}
