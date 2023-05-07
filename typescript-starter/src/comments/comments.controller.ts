import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { Comment } from './comment.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { CreateCommentCommand } from './commands/implementations/createComment.command';
import { GetCommentsQuery } from './queries/implementations/getComments.query';
import GetCommentsDto from './dto/getComments.dto';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(@Body() comment: Comment, @Req() req: RequestWithUser) {
    const user = req.user;
    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
