import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsController } from './comments.controller';
import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
import { Comment } from './comment.entity';
import { GetCommentsHandler } from './queries/handlers/get-comment.handler';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule, PostsModule],
  controllers: [CommentsController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export class CommentsModule {}
