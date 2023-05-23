import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { Readable } from 'stream';

@Controller('optimize')
export class OptimizeController {
  constructor(@InjectQueue('image') private readonly imageQueue: Queue) {}

  @Post('image')
  @UseInterceptors(AnyFilesInterceptor())
  async processImage(@UploadedFiles() files: Express.Multer.File[]) {
    const job = await this.imageQueue.add('optimize', { files });
    return {
      jobId: job.id,
    };
  }

  @Get('image/:id')
  async getJobResult(
    @Res()
    response: Response,
    @Param('id') id: string,
  ) {
    const job = await this.imageQueue.getJob(id);
    if (!job) {
      return response.sendStatus(HttpStatus.NOT_FOUND);
    }
    const isCompleted = await job.isCompleted();
    const isFailed = await job.isFailed();
    if (isFailed) {
      return response.json({ success: false });
    }
    if (!isCompleted) {
      return response.sendStatus(HttpStatus.ACCEPTED);
    }

    const result = await Buffer.from(job.returnvalue);
    const stream = Readable.from(result);
    stream.pipe(response);
  }
}
