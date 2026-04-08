import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { productId: number; rating: number; comment: string; imageUrls?: string[] }) {
    const order = await this.prisma.order.findFirst({ where: { userId, status: 'delivered', items: { some: { productId: data.productId } } } });
    if (!order) throw new BadRequestException('Can only review delivered products');
    return this.prisma.review.create({ data: { userId, productId: data.productId, rating: data.rating, comment: data.comment, imageUrls: data.imageUrls || [] } });
  }

  findByProduct(productId: number) {
    return this.prisma.review.findMany({ where: { productId }, include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async getAverageRating(productId: number) {
    const result = await this.prisma.review.aggregate({ where: { productId }, _avg: { rating: true } });
    return result._avg.rating || 0;
  }

  delete(id: number) { return this.prisma.review.delete({ where: { id } }); }
}
