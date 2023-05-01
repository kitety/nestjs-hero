import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';

@Controller('category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {}
