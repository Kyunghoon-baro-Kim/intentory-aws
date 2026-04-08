import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InfluencerService } from './influencer.service';
import { CreateInfluencerProfileDto, UpdateInfluencerProfileDto } from './dto/influencer-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('influencer')
export class InfluencerController {
  constructor(private influencerService: InfluencerService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  findAll() { return this.influencerService.findAll(); }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.influencer)
  getMyProfile(@CurrentUser() user: any) { return this.influencerService.findByUserId(user.id); }

  @Post('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.influencer)
  createProfile(@CurrentUser() user: any, @Body() dto: CreateInfluencerProfileDto) {
    return this.influencerService.createProfile(user.id, dto);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.influencer)
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateInfluencerProfileDto) {
    return this.influencerService.updateProfile(user.id, dto);
  }
}
