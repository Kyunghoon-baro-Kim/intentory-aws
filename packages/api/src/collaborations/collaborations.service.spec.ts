import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollaborationsService } from './collaborations.service';

describe('CollaborationsService', () => {
  let service: CollaborationsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      collaboration: {
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
      },
    };
    service = new CollaborationsService(prisma);
  });

  describe('create', () => {
    it('should create a collaboration proposal', async () => {
      const data = { influencerProfileId: 1, productId: 1, terms: 'Review video', compensation: '$500' };
      prisma.collaboration.create.mockResolvedValue({ id: 1, ...data, status: 'proposed' });

      const result = await service.create(data);
      expect(result.status).toBe('proposed');
      expect(result.terms).toBe('Review video');
    });
  });

  describe('updateStatus', () => {
    it('should transition from proposed to accepted', async () => {
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });

      const result = await service.updateStatus(1, 'accepted');
      expect(result.status).toBe('accepted');
    });

    it('should transition from accepted to in_progress', async () => {
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'in_progress' });

      const result = await service.updateStatus(1, 'in_progress');
      expect(result.status).toBe('in_progress');
    });

    it('should transition to completed', async () => {
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'completed' });

      const result = await service.updateStatus(1, 'completed');
      expect(result.status).toBe('completed');
    });
  });

  describe('findByInfluencer', () => {
    it('should return collaborations for an influencer', async () => {
      prisma.collaboration.findMany.mockResolvedValue([
        { id: 1, status: 'proposed', product: { name: 'Laptop' } },
        { id: 2, status: 'completed', product: { name: 'Mouse' } },
      ]);

      const result = await service.findByInfluencer(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should return all collaborations with relations', async () => {
      prisma.collaboration.findMany.mockResolvedValue([
        { id: 1, product: { name: 'Laptop' }, influencerProfile: { user: { name: 'Inf1' } } },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });
});
