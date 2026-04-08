import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InfluencerService } from './influencer.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('InfluencerService', () => {
  let service: InfluencerService;
  let prisma: any;

  beforeEach(() => {
    prisma = { influencerProfile: { create: vi.fn(), update: vi.fn(), findMany: vi.fn(), findUnique: vi.fn() } };
    service = new InfluencerService(prisma);
  });

  describe('createProfile', () => {
    it('should create profile', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      prisma.influencerProfile.create.mockResolvedValue({ id: 1, userId: 1, channelUrl: 'url' });
      expect((await service.createProfile(1, { channelUrl: 'url', subscribers: 100, category: 'tech' })).channelUrl).toBe('url');
    });

    it('should reject duplicate', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.createProfile(1, { channelUrl: 'url', subscribers: 100, category: 'tech' })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateProfile', () => {
    it('should update', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1 });
      prisma.influencerProfile.update.mockResolvedValue({ id: 1, subscribers: 20000 });
      expect((await service.updateProfile(1, { subscribers: 20000 })).subscribers).toBe(20000);
    });

    it('should reject non-existent', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      await expect(service.updateProfile(999, { subscribers: 100 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle public to private', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1, userId: 1, isPublic: true });
      prisma.influencerProfile.update.mockResolvedValue({ id: 1, isPublic: false });
      expect((await service.toggleVisibility(1)).isPublic).toBe(false);
    });

    it('should toggle private to public', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1, userId: 1, isPublic: false });
      prisma.influencerProfile.update.mockResolvedValue({ id: 1, isPublic: true });
      expect((await service.toggleVisibility(1)).isPublic).toBe(true);
    });

    it('should reject non-existent', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      await expect(service.toggleVisibility(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProfileWithStats', () => {
    it('should return profile with aggregated stats', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({
        id: 1, userId: 1, channelUrl: 'url', subscribers: 1000, category: 'tech',
        collaborations: [{ id: 1, status: 'proposed' }, { id: 2, status: 'completed' }],
        user: { name: 'Inf1', email: 'inf@test.com', referralLinks: [{ commissions: [{ amount: 5 }, { amount: 10 }] }] },
      });
      const result = await service.getProfileWithStats(1);
      expect(result.stats.totalCollabs).toBe(2);
      expect(result.stats.activeCollabs).toBe(1);
      expect(result.stats.totalReferralLinks).toBe(1);
      expect(result.stats.totalCommission).toBe(15);
    });

    it('should reject non-existent', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      await expect(service.getProfileWithStats(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return only public profiles', async () => {
      prisma.influencerProfile.findMany.mockResolvedValue([{ id: 1 }]);
      expect(await service.findAll()).toHaveLength(1);
      expect(prisma.influencerProfile.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isPublic: true } }));
    });
  });

  describe('findByUserId', () => {
    it('should return profile', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      expect((await service.findByUserId(1))?.userId).toBe(1);
    });

    it('should return null if not found', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);
      expect(await service.findByUserId(999)).toBeNull();
    });
  });
});
