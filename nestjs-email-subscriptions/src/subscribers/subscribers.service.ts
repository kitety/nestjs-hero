import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './subscriber.entity';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}

  async addSubscriber(subscriber: CreateSubscriberDto) {
    subscriber.email = String(Math.random());
    const newSubscriber = await this.subscribersRepository.create(subscriber);
    try {
      await this.subscribersRepository.save(newSubscriber);
      return newSubscriber;
    } catch (error) {
      const isSameEmail = error?.code === PostgresErrorCode.UniqueViolation;
      return {
        error: true,
        msg: isSameEmail
          ? 'User with this email already exists'
          : 'Something went wrong',
      };
    }
  }

  getAllSubscribers() {
    return this.subscribersRepository.find();
  }
}
