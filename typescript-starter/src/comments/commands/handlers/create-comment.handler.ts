import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../implementations/createComment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../comment.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GET_POSTS_CACHE_KEY } from '../../../posts/postsCacheKey.constant';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
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

  async execute(command: CreateCommentCommand) {
    const newPost = this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });
    await this.commentRepository.save(newPost);
    await this.clearCache();
    return newPost;
  }
}
