import { Controller } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @EventPattern({ cmd: 'add-subscriber' })
  addSubscriber(subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }

  @EventPattern({ cmd: 'get-all-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }

  // mq
  @EventPattern({ cmd: '2add-subscriber' })
  async addSubscriber2(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    // const newSubscriber = await this.subscribersService.addSubscriber(
    //   subscriber,
    // );

    setTimeout(() => {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      const isRetry = Math.random() > 0.5;
      if (isRetry) {
        channel.nack(originalMsg);
      } else {
        channel.ack(originalMsg);
      }
      console.log(
        '2add-subscriber',
        isRetry,
        new Date().toLocaleTimeString(),
        subscriber,
      );
    }, 1000);
  }

  @EventPattern({ cmd: '2get-all-subscribers' })
  getAllSubscribers2() {
    console.log('2get-all-subscribers');
    return this.subscribersService.getAllSubscribers();
  }
}
