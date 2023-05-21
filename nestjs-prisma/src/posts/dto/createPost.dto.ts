import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsISO8601({
    strict: true,
  })
  @IsOptional()
  scheduledDate?: string;
}
