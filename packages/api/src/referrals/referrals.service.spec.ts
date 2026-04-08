import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralsService } from './referrals.service';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      referralLink: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
      commission: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
    };
    service = new ReferralsService(prisma);
  });

  describe('generateLink', () => {
    it('should create a referral link with unique code', async () => {
      prisma.referralLink.create.mockResolvedValue({ id: 1, userId: 1, productId: 1, code: 'abc123def456' });

      const result = await service.generateLink(1, 1);
      expect(result.code).toBeDefined();
      expect(result.code.length).toBeGreaterThan(0);
      expect(prisma.referralLink.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ userId: 1, productId: 1 }) }),
      );
    });
  });

  describe('trackReferral', () => {
    it('should create commission when valid referral code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.commission.create.mockResolvedValue({ id: 1, referralLinkId: 1, orderId: 10, amount: 5.0, status: 'pending' });

      const result = await service.trackReferral('abc123', 10, 100.0, 0.05);
      expect(result?.amount).toBe(5.0);
      expect(result?.status).toBe('pending');
    });

    it('should return null for invalid referral code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue(null);

      const result = await service.trackReferral('invalid', 10, 100.0);
      expect(result).toBeNull();
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

  describe('getStats', () => {
    it('should return referral links with commissions for influencer', async () => {
      prisma.referralLink.findMany.mockResolvedValue([
        { id: 1, code: 'abc', commissions: [{ amount: 5.0 }, { amount: 3.0 }] },
      ]);

      const result = await service.getStats(1);
      expect(result).toHaveLength(1);
      expect(result[0].commissions).toHaveLength(2);
    });
  });

  describe('getCommissions', () => {
    it('should return all commissions for admin', async () => {
      prisma.commission.findMany.mockResolvedValue([
        { id: 1, amount: 5.0, referralLink: { user: { name: 'Inf1' }, product: { name: 'Laptop' } } },
      ]);

      const result = await service.getCommissions();
      expect(result).toHaveLength(1);
    });

    it('should filter commissions by userId for influencer', async () => {
      prisma.commission.findMany.mockResolvedValue([]);

      await service.getCommissions(1);
      expect(prisma.commission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { referralLink: { userId: 1 } } }),
      );
    });
  });

  describe('getMyLinks', () => {
    it('should return links with product names', async () => {
      prisma.referralLink.findMany.mockResolvedValue([
        { id: 1, code: 'abc', product: { name: 'Laptop' } },
      ]);

      const result = await service.getMyLinks(1);
      expect(result[0].product.name).toBe('Laptop');
    });
  });
});
