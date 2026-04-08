import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewsService } from './reviews.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      review: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), aggregate: vi.fn(), delete: vi.fn(), update: vi.fn(), count: vi.fn() },
      order: { findFirst: vi.fn() },
    };
    service = new ReviewsService(prisma);
  });

  describe('create', () => {
    it('should create a review for delivered product', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1 });
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 1, rating: 5, comment: 'Great!' });
      const result = await service.create(1, { productId: 1, rating: 5, comment: 'Great!' });
      expect(result.rating).toBe(5);
    });

    it('should reject non-delivered product', async () => {
      prisma.order.findFirst.mockResolvedValue(null);
      await expect(service.create(1, { productId: 1, rating: 5, comment: 'Great!' })).rejects.toThrow(BadRequestException);
    });

    it('should reject duplicate review', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1 });
      prisma.review.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.create(1, { productId: 1, rating: 5, comment: 'Great!' })).rejects.toThrow(ConflictException);
    });

    it('should reject invalid rating', async () => {
      await expect(service.create(1, { productId: 1, rating: 0, comment: 'Bad' })).rejects.toThrow(BadRequestException);
      await expect(service.create(1, { productId: 1, rating: 6, comment: 'Bad' })).rejects.toThrow(BadRequestException);
    });

    it('should reject empty comment', async () => {
      await expect(service.create(1, { productId: 1, rating: 5, comment: '  ' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update own review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.review.update.mockResolvedValue({ id: 1, rating: 4 });
      expect((await service.update(1, 1, { rating: 4 })).rating).toBe(4);
    });

    it('should reject editing another user review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 1, userId: 2 });
      await expect(service.update(1, 1, { rating: 4 })).rejects.toThrow(BadRequestException);
    });

    it('should reject non-existent review', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(service.update(1, 999, { rating: 4 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProduct', () => {
    it('should return paginated reviews with total', async () => {
      prisma.review.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      prisma.review.count.mockResolvedValue(15);
      const result = await service.findByProduct(1, 1, 10);
      expect(result.reviews).toHaveLength(2);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('getAverageRating', () => {
    it('should return average and count', async () => {
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 10 } });
      const result = await service.getAverageRating(1);
      expect(result).toEqual({ average: 4.5, count: 10 });
    });

    it('should return 0 when no reviews', async () => {
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: { rating: 0 } });
      expect((await service.getAverageRating(1)).average).toBe(0);
    });
  });

  describe('findAll', () => {
    it('should return all reviews for admin', async () => {
      prisma.review.findMany.mockResolvedValue([{ id: 1, user: { name: 'U1' }, product: { name: 'P1' } }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
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
