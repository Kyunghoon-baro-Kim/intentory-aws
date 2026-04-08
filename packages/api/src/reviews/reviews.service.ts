import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { productId: number; rating: number; comment: string; imageUrls?: string[] }) {
    if (data.rating < 1 || data.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');
    if (!data.comment?.trim()) throw new BadRequestException('Comment is required');

    const order = await this.prisma.order.findFirst({ where: { userId, status: 'delivered', items: { some: { productId: data.productId } } } });
    if (!order) throw new BadRequestException('Can only review delivered products');

    const existing = await this.prisma.review.findUnique({ where: { userId_productId: { userId, productId: data.productId } } });
    if (existing) throw new ConflictException('You have already reviewed this product');

    return this.prisma.review.create({ data: { userId, productId: data.productId, rating: data.rating, comment: data.comment.trim(), imageUrls: data.imageUrls || [] } });
  }

  async update(userId: number, reviewId: number, data: { rating?: number; comment?: string; imageUrls?: string[] }) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) throw new BadRequestException('Cannot edit another user\'s review');
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) throw new BadRequestException('Rating must be between 1 and 5');

    return this.prisma.review.update({ where: { id: reviewId }, data: { ...data, comment: data.comment?.trim() } });
  }

  async findByProduct(productId: number, page = 1, limit = 10) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getAverageRating(productId: number) {
    const result = await this.prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: { rating: true } });
    return { average: result._avg.rating || 0, count: result._count.rating };
  }

  findAll() {
    return this.prisma.review.findMany({
      include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: number) { return this.prisma.review.delete({ where: { id } }); }
}
