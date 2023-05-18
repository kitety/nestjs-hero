import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticationService } from '../authentication/authentication.service';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { Repository } from 'typeorm';
import User from '../users/user.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async;

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        authenticationToken,
      );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async saveMessage(content: string, author: User) {
    const newMessage = await this.messageRepository.create({ content, author });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return await this.messageRepository.find({
      relations: ['author'],
    });
  }
}
