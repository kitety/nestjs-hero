import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OptimizeController } from './optimize.controller';
import { ImageProcessor } from './image.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image',
      // processors: [
      //   {
      //     name: 'optimize',
      //     path: join(__dirname, 'image.processor.js'),
      //   },
      // ],
    }),
  ],
  providers: [ImageProcessor],
  controllers: [OptimizeController],
  exports: [],
})
export class OptimizeModule {}
