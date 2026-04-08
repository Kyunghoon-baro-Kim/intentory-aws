import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollaborationsService } from './collaborations.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('collaborations')
@UseGuards(AuthGuard('jwt'))
export class CollaborationsController {
  constructor(private collabService: CollaborationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  create(@Body() body: { influencerProfileId: number; productId: number; terms: string; compensation?: string }) {
    return this.collabService.create(body);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  findAll() { return this.collabService.findAll(); }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(Role.influencer)
  async findMy(@CurrentUser() user: any) {
    // influencer profile lookup needed
    return this.collabService.findByInfluencer(user.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.collabService.updateStatus(id, body.status);
  }
}
