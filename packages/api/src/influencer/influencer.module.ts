import { Module } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { InfluencerController } from './influencer.controller';
@Module({ controllers: [InfluencerController], providers: [InfluencerService], exports: [InfluencerService] })
export class InfluencerModule {}
