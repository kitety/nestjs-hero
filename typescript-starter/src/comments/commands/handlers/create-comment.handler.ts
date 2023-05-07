import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../implementations/createComment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../comment.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const newPost = this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });
    await this.commentRepository.save(newPost);
    return newPost;
  }
}
