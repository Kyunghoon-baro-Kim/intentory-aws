import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollaborationsService } from './collaborations.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

vi.mock('@prisma/client', () => ({
  CollaborationStatus: { proposed: 'proposed', accepted: 'accepted', rejected: 'rejected', in_progress: 'in_progress', completed: 'completed' },
}));

describe('CollaborationsService', () => {
  let service: CollaborationsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      collaboration: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
      influencerProfile: { findUnique: vi.fn() },
    };
    service = new CollaborationsService(prisma);
  });

  describe('create', () => {
    it('should create a collaboration', async () => {
      prisma.collaboration.create.mockResolvedValue({ id: 1, status: 'proposed' });
      expect((await service.create({ influencerProfileId: 1, productId: 1, terms: 'Review' })).status).toBe('proposed');
    });
  });

  describe('updateStatus — valid transitions', () => {
    it('proposed → accepted', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed', influencerProfile: { userId: 10 } });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });
      expect((await service.updateStatus(1, 'accepted')).status).toBe('accepted');
    });

    it('proposed → rejected', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed', influencerProfile: { userId: 10 } });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'rejected' });
      expect((await service.updateStatus(1, 'rejected')).status).toBe('rejected');
    });

    it('accepted → in_progress', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'accepted', influencerProfile: { userId: 10 } });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'in_progress' });
      expect((await service.updateStatus(1, 'in_progress')).status).toBe('in_progress');
    });

    it('in_progress → completed', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'in_progress', influencerProfile: { userId: 10 } });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'completed' });
      expect((await service.updateStatus(1, 'completed')).status).toBe('completed');
    });
  });

  describe('updateStatus — invalid transitions', () => {
    it('proposed → completed should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed', influencerProfile: { userId: 10 } });
      await expect(service.updateStatus(1, 'completed')).rejects.toThrow(BadRequestException);
    });

    it('non-existent should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus(999, 'accepted')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus — influencer permissions', () => {
    it('influencer can accept proposed collaboration', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed', influencerProfile: { userId: 10 } });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });
      expect((await service.updateStatus(1, 'accepted', 10, 'influencer')).status).toBe('accepted');
    });

    it('influencer cannot transition to in_progress', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'accepted', influencerProfile: { userId: 10 } });
      await expect(service.updateStatus(1, 'in_progress', 10, 'influencer')).rejects.toThrow(ForbiddenException);
    });

    it('influencer cannot modify other influencer collaboration', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed', influencerProfile: { userId: 20 } });
      await expect(service.updateStatus(1, 'accepted', 10, 'influencer')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findById', () => {
    it('should return collaboration with details', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, product: { name: 'Laptop' }, influencerProfile: { user: { name: 'Inf1' } } });
      const result = await service.findById(1);
      expect(result.product.name).toBe('Laptop');
    });

    it('should throw if not found', async () => {
      prisma.collaboration.findUnique.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByInfluencerUserId', () => {
    it('should find via profile lookup', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 10, userId: 1 });
      prisma.collaboration.findMany.mockResolvedValue([{ id: 1 }]);
      expect(await service.findByInfluencerUserId(1)).toHaveLength(1);
    });

    it('should throw if profile not found', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      await expect(service.findByInfluencerUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all collaborations', async () => {
      prisma.collaboration.findMany.mockResolvedValue([{ id: 1 }]);
      expect(await service.findAll()).toHaveLength(1);
    });
  });
});
