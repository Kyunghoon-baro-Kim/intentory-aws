import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCollaborationDto {
  @IsInt()
  @Min(1)
  influencerProfileId!: number;

  @IsInt()
  @Min(1)
  productId!: number;

  @IsString()
  terms!: string;

  @IsOptional()
  @IsString()
  compensation?: string;
}
