import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscribersController } from './subscribers.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SubscribersController],
  providers: [
    // {
    // microService
    // provide: 'SUBSCRIBERS_SERVICE',
    // inject: [ConfigService],
    // useFactory: (configService: ConfigService) => {
    //   return ClientProxyFactory.create({
    //     transport: Transport.TCP,
    //     options: {
    //       port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
    //     },
    //   });
    // },
    // },
    {
      // mq
      provide: 'SUBSCRIBERS_SERVICE_MQ',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            noAck: true,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class SubscribersModule {}
