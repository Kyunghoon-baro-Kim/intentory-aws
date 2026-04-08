import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateCollaborationDto {
  @IsInt()
  influencerProfileId!: number;

  @IsInt()
  productId!: number;

  @IsString()
  terms!: string;

  @IsOptional()
  @IsString()
  compensation?: string;
}
