import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewsService } from './reviews.service';
import { BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      review: {
        create: vi.fn(),
        findMany: vi.fn(),
        aggregate: vi.fn(),
        delete: vi.fn(),
      },
      order: { findFirst: vi.fn() },
    };
    service = new ReviewsService(prisma);
  });

  describe('create', () => {
    it('should create a review for delivered product', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1, status: 'delivered' });
      prisma.review.create.mockResolvedValue({ id: 1, userId: 1, productId: 1, rating: 5, comment: 'Great!', imageUrls: [] });

      const result = await service.create(1, { productId: 1, rating: 5, comment: 'Great!' });
      expect(result.rating).toBe(5);
      expect(prisma.review.create).toHaveBeenCalled();
    });

    it('should reject review for non-delivered product', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.create(1, { productId: 1, rating: 5, comment: 'Great!' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should accept review with image urls', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1 });
      prisma.review.create.mockResolvedValue({ id: 1, imageUrls: ['img1.jpg', 'img2.jpg'] });

      const result = await service.create(1, { productId: 1, rating: 4, comment: 'Nice product', imageUrls: ['img1.jpg', 'img2.jpg'] });
      expect(result.imageUrls).toHaveLength(2);
    });
  });

  describe('findByProduct', () => {
    it('should return reviews for a product', async () => {
      prisma.review.findMany.mockResolvedValue([
        { id: 1, rating: 5, comment: 'Great', user: { name: 'User1' } },
        { id: 2, rating: 3, comment: 'OK', user: { name: 'User2' } },
      ]);

      const result = await service.findByProduct(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('getAverageRating', () => {
    it('should return average rating', async () => {
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });

      const result = await service.getAverageRating(1);
      expect(result).toBe(4.5);
    });

    it('should return 0 when no reviews', async () => {
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });

      const result = await service.getAverageRating(1);
      expect(result).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete a review', async () => {
      prisma.review.delete.mockResolvedValue({ id: 1 });

      await service.delete(1);
      expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
