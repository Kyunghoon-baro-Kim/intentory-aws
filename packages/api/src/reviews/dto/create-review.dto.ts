import { IsInt, IsString, Min, Max, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(10)
  comment!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
