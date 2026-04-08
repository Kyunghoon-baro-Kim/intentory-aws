import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InfluencerService } from './influencer.service';

describe('InfluencerService', () => {
  let service: InfluencerService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      influencerProfile: {
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    service = new InfluencerService(prisma);
  });

  describe('createProfile', () => {
    it('should create an influencer profile', async () => {
      const profileData = { channelUrl: 'https://youtube.com/@test', subscribers: 10000, category: 'tech', bio: 'Tech reviewer' };
      prisma.influencerProfile.create.mockResolvedValue({ id: 1, userId: 1, ...profileData, isPublic: true });

      const result = await service.createProfile(1, profileData);
      expect(result.channelUrl).toBe('https://youtube.com/@test');
      expect(result.subscribers).toBe(10000);
    });
  });

  describe('updateProfile', () => {
    it('should update profile fields', async () => {
      prisma.influencerProfile.update.mockResolvedValue({ id: 1, userId: 1, subscribers: 20000 });

      const result = await service.updateProfile(1, { subscribers: 20000 });
      expect(result.subscribers).toBe(20000);
    });
  });

  describe('findAll', () => {
    it('should return only public profiles', async () => {
      prisma.influencerProfile.findMany.mockResolvedValue([
        { id: 1, isPublic: true, user: { name: 'Influencer1', email: 'i1@test.com' } },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(prisma.influencerProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublic: true } }),
      );
    });
  });

  describe('findByUserId', () => {
    it('should return profile for user', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue({ id: 1, userId: 1 });

      const result = await service.findByUserId(1);
      expect(result?.userId).toBe(1);
    });

    it('should return null for non-existent profile', async () => {
      prisma.influencerProfile.findUnique.mockResolvedValue(null);

      const result = await service.findByUserId(999);
      expect(result).toBeNull();
    });
  });
});
