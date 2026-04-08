import { Controller, Get, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReferralsService } from './referrals.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('referrals')
@UseGuards(AuthGuard('jwt'))
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Post('link/:productId')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  generateLink(@CurrentUser() user: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.referralsService.generateLink(user.id, productId);
  }

  @Get('my-links')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  getMyLinks(@CurrentUser() user: any) { return this.referralsService.getMyLinks(user.id); }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  getStats(@CurrentUser() user: any) { return this.referralsService.getStats(user.id); }

  @Get('stats/summary')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  getStatsSummary(@CurrentUser() user: any) { return this.referralsService.getStatsSummary(user.id); }

  @Get('commissions')
  @UseGuards(RolesGuard)
  @Roles(Role.admin_a)
  getAllCommissions() { return this.referralsService.getCommissions(); }

  @Get('commissions/my')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  getMyCommissions(@CurrentUser() user: any) { return this.referralsService.getCommissions(user.id); }
}
