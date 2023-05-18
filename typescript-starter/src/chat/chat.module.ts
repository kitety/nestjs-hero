import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthenticationModule, TypeOrmModule.forFeature([Message])],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
