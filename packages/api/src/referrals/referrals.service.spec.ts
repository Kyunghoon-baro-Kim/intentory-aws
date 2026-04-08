import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralsService } from './referrals.service';
import { ConflictException } from '@nestjs/common';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      referralLink: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() },
      commission: { create: vi.fn(), findMany: vi.fn() },
    };
    service = new ReferralsService(prisma);
  });

  describe('generateLink', () => {
    it('should create a referral link with unique code', async () => {
      prisma.referralLink.findFirst.mockResolvedValue(null);
      prisma.referralLink.create.mockResolvedValue({ id: 1, userId: 1, productId: 1, code: 'abc123def456' });

      const result = await service.generateLink(1, 1);
      expect(result.code).toBeDefined();
    });

    it('should reject duplicate link for same product', async () => {
      prisma.referralLink.findFirst.mockResolvedValue({ id: 1, userId: 1, productId: 1 });
      await expect(service.generateLink(1, 1)).rejects.toThrow(ConflictException);
    });
  });

  describe('trackReferral', () => {
    it('should create commission when valid referral code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.commission.create.mockResolvedValue({ id: 1, referralLinkId: 1, orderId: 10, amount: 5.0, status: 'pending' });

      const result = await service.trackReferral('abc123', 10, 100.0, 0.05);
      expect(result?.amount).toBe(5.0);
    });

    it('should return null for invalid referral code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue(null);
      expect(await service.trackReferral('invalid', 10, 100.0)).toBeNull();
    });

    it('should calculate commission with default 5% rate', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1 });
      prisma.commission.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 1, ...data }));

      const result = await service.trackReferral('abc123', 10, 200.0);
      expect(result?.amount).toBe(10.0);
    });

    it('should calculate commission with custom rate', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1 });
      prisma.commission.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 1, ...data }));

      const result = await service.trackReferral('abc123', 10, 200.0, 0.10);
      expect(result?.amount).toBe(20.0);
    });
  });

  describe('getStatsSummary', () => {
    it('should aggregate stats correctly', async () => {
      prisma.referralLink.findMany.mockResolvedValue([
        { id: 1, commissions: [{ amount: 5.0 }, { amount: 3.0 }] },
        { id: 2, commissions: [{ amount: 10.0 }] },
      ]);

      const result = await service.getStatsSummary(1);
      expect(result.totalLinks).toBe(2);
      expect(result.totalOrders).toBe(3);
      expect(result.totalCommission).toBe(18.0);
    });

    it('should return zeros when no links', async () => {
      prisma.referralLink.findMany.mockResolvedValue([]);
      const result = await service.getStatsSummary(1);
      expect(result).toEqual({ totalLinks: 0, totalOrders: 0, totalCommission: 0 });
    });
  });

  describe('getCommissions', () => {
    it('should return all commissions for admin', async () => {
      prisma.commission.findMany.mockResolvedValue([{ id: 1, amount: 5.0 }]);
      const result = await service.getCommissions();
      expect(result).toHaveLength(1);
    });

    it('should filter commissions by userId for influencer', async () => {
      prisma.commission.findMany.mockResolvedValue([]);
      await service.getCommissions(1);
      expect(prisma.commission.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { referralLink: { userId: 1 } } }));
    });
  });

  describe('getMyLinks', () => {
    it('should return links with product and commission info', async () => {
      prisma.referralLink.findMany.mockResolvedValue([{ id: 1, code: 'abc', product: { name: 'Laptop', price: 999 }, commissions: [{ amount: 50, status: 'pending' }] }]);
      const result = await service.getMyLinks(1);
      expect(result[0].product.name).toBe('Laptop');
      expect(result[0].commissions).toHaveLength(1);
    });
  });
});
