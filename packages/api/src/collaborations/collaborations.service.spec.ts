import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollaborationsService } from './collaborations.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
    it('should create a collaboration proposal', async () => {
      const data = { influencerProfileId: 1, productId: 1, terms: 'Review video', compensation: '$500' };
      prisma.collaboration.create.mockResolvedValue({ id: 1, ...data, status: 'proposed' });
      const result = await service.create(data);
      expect(result.status).toBe('proposed');
    });
  });

  describe('updateStatus — valid transitions', () => {
    it('proposed → accepted', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed' });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });
      expect((await service.updateStatus(1, 'accepted')).status).toBe('accepted');
    });

    it('proposed → rejected', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed' });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'rejected' });
      expect((await service.updateStatus(1, 'rejected')).status).toBe('rejected');
    });

    it('accepted → in_progress', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'accepted' });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'in_progress' });
      expect((await service.updateStatus(1, 'in_progress')).status).toBe('in_progress');
    });

    it('in_progress → completed', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'in_progress' });
      prisma.collaboration.update.mockResolvedValue({ id: 1, status: 'completed' });
      expect((await service.updateStatus(1, 'completed')).status).toBe('completed');
    });
  });

  describe('updateStatus — invalid transitions', () => {
    it('proposed → completed should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed' });
      await expect(service.updateStatus(1, 'completed')).rejects.toThrow(BadRequestException);
    });

    it('rejected → accepted should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'rejected' });
      await expect(service.updateStatus(1, 'accepted')).rejects.toThrow(BadRequestException);
    });

    it('completed → proposed should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'completed' });
      await expect(service.updateStatus(1, 'proposed')).rejects.toThrow(BadRequestException);
    });

    it('non-existent collaboration should fail', async () => {
      prisma.collaboration.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus(999, 'accepted')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByInfluencerUserId', () => {
    it('should find collaborations by userId via profile lookup', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 10, userId: 1 });
      prisma.collaboration.findMany.mockResolvedValue([{ id: 1, status: 'proposed', product: { name: 'Laptop' } }]);

      const result = await service.findByInfluencerUserId(1);
      expect(result).toHaveLength(1);
      expect(prisma.collaboration.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { influencerProfileId: 10 } }));
    });

    it('should throw if influencer profile not found', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      await expect(service.findByInfluencerUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all collaborations', async () => {
      prisma.collaboration.findMany.mockResolvedValue([{ id: 1, product: { name: 'Laptop' }, influencerProfile: { user: { name: 'Inf1' } } }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });
});
