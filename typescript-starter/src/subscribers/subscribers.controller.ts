import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { lastValueFrom } from 'rxjs';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    // @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
    @Inject('SUBSCRIBERS_SERVICE_MQ') private subscribersService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getSubscribers() {
    this.subscribersService.emit(
      {
        cmd: '2get-all-subscribers',
      },
      '',
    );
    return 1;
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async addSubscriber(@Body() subscriber: CreateSubscriberDto) {
    await lastValueFrom(
      this.subscribersService.emit(
        {
          cmd: '2add-subscriber',
        },
        subscriber,
      ),
    );

    return subscriber;
  }

  //microservice
  // @Get()
  // @UseGuards(JwtAuthenticationGuard)
  // async getSubscribers() {
  //   return this.subscribersService.send(
  //     {
  //       cmd: 'get-all-subscribers',
  //     },
  //     '',
  //   );
  // }
  //
  // @Post()
  // @UseGuards(JwtAuthenticationGuard)
  // async addSubscriber(@Body() subscriber: CreateSubscriberDto) {
  //   return this.subscribersService.send(
  //     {
  //       cmd: 'add-subscriber',
  //     },
  //     subscriber,
  //   );
  // }
}
