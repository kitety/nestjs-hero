import { Controller } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  addSubscriber(subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }

  @MessagePattern({ cmd: 'get-all-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }

  // mq
  @MessagePattern({ cmd: '2add-subscriber' })
  async addSubscriber2(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    // const newSubscriber = await this.subscribersService.addSubscriber(
    //   subscriber,
    // );

    setTimeout(() => {
      console.log(
        '2add-subscriber',
        new Date().toLocaleTimeString(),
        subscriber,
      );

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    }, 1000);
  }

  @MessagePattern({ cmd: '2get-all-subscribers' })
  getAllSubscribers2() {
    console.log('2get-all-subscribers');
    return this.subscribersService.getAllSubscribers();
  }
}
