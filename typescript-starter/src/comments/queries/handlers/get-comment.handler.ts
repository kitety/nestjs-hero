import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommentsQuery } from '../implementations/getComments.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../comment.entity';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery) {
    if (query.postId) {
      return this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.post', 'post')
        .where('post.id = :postId', { postId: query.postId })
        .getMany();
    }
    return this.commentRepository.find();
  }
}
