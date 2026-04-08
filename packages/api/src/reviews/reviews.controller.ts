import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@CurrentUser() user: any, @Body() body: { productId: number; rating: number; comment: string; imageUrls?: string[] }) {
    return this.reviewsService.create(user.id, body);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) { return this.reviewsService.findByProduct(productId); }

  @Get('product/:productId/rating')
  getAverageRating(@Param('productId', ParseIntPipe) productId: number) { return this.reviewsService.getAverageRating(productId); }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  delete(@Param('id', ParseIntPipe) id: number) { return this.reviewsService.delete(id); }
}
