import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import * as Joi from '@hapi/joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailSchedulingModule } from './emailScheduling/emailScheduling.module';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';
import * as process from 'process';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSubModule } from './pubSub/pubSub.module';
import { TimestampScalar } from './utils/scalars/timestamp.scalar';
import { BullModule } from '@nestjs/bull';
import { OptimizeModule } from './optimize/optimize.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
      }),
    }),
    ScheduleModule.forRoot(),
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        SUBSCRIBERS_SERVICE_HOST: Joi.string().required(),
        SUBSCRIBERS_SERVICE_PORT: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.number(),
        TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    SearchModule,
    SubscribersModule,
    CommentsModule,
    EmailModule,
    EmailSchedulingModule,
    ChatModule,
    PubSubModule,
    OptimizeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TimestampScalar,
    // exception 2
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionsLoggerFilter,
    // },
  ],
})
export class AppModule {}
