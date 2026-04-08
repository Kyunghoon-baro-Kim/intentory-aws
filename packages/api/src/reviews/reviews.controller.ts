import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.customer)
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.customer)
  update(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Body() dto: { rating?: number; comment?: string; imageUrls?: string[] }) {
    return this.reviewsService.update(user.id, id, dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.reviewsService.findByProduct(productId, Number(page) || 1, Number(limit) || 10);
  }

  @Get('product/:productId/rating')
  getAverageRating(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.getAverageRating(productId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin_a, Role.admin_b)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.delete(id);
  }
}
