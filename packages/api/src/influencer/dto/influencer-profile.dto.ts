import { IsString, IsInt, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateInfluencerProfileDto {
  @IsUrl()
  channelUrl!: string;

  @IsInt()
  @Min(0)
  subscribers!: number;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateInfluencerProfileDto {
  @IsOptional()
  @IsUrl()
  channelUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  subscribers?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
