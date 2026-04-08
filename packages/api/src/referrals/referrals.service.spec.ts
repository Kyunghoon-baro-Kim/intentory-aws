import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralsService } from './referrals.service';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      referralLink: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() },
      commission: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    };
    service = new ReferralsService(prisma);
  });

  describe('generateLink', () => {
    it('should create a referral link', async () => {
      prisma.referralLink.findFirst.mockResolvedValue(null);
      prisma.referralLink.create.mockResolvedValue({ id: 1, code: 'abc123' });
      expect((await service.generateLink(1, 1)).code).toBeDefined();
    });

    it('should reject duplicate link', async () => {
      prisma.referralLink.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.generateLink(1, 1)).rejects.toThrow(ConflictException);
    });
  });

  describe('trackReferral', () => {
    it('should create commission for valid code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 10 });
      prisma.commission.create.mockResolvedValue({ id: 1, amount: 5.0, status: 'pending' });
      const result = await service.trackReferral('abc', 1, 100, 5, 0.05);
      expect(result?.amount).toBe(5.0);
    });

    it('should return null for invalid code', async () => {
      prisma.referralLink.findUnique.mockResolvedValue(null);
      expect(await service.trackReferral('invalid', 1, 100, 5)).toBeNull();
    });

    it('should return null for self-referral', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 10 });
      expect(await service.trackReferral('abc', 1, 100, 10)).toBeNull();
    });

    it('should calculate with default 5% rate', async () => {
      prisma.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 10 });
      prisma.commission.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 1, ...data }));
      expect((await service.trackReferral('abc', 1, 200, 5))?.amount).toBe(10.0);
    });
  });

  describe('updateCommissionStatus', () => {
    it('pending → approved', async () => {
      prisma.commission.findUnique.mockResolvedValue({ id: 1, status: 'pending' });
      prisma.commission.update.mockResolvedValue({ id: 1, status: 'approved' });
      expect((await service.updateCommissionStatus(1, 'approved')).status).toBe('approved');
    });

    it('approved → paid', async () => {
      prisma.commission.findUnique.mockResolvedValue({ id: 1, status: 'approved' });
      prisma.commission.update.mockResolvedValue({ id: 1, status: 'paid' });
      expect((await service.updateCommissionStatus(1, 'paid')).status).toBe('paid');
    });

    it('pending → paid should fail', async () => {
      prisma.commission.findUnique.mockResolvedValue({ id: 1, status: 'pending' });
      await expect(service.updateCommissionStatus(1, 'paid')).rejects.toThrow(BadRequestException);
    });

    it('non-existent should fail', async () => {
      prisma.commission.findUnique.mockResolvedValue(null);
      await expect(service.updateCommissionStatus(999, 'approved')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatsSummary', () => {
    it('should aggregate correctly', async () => {
      prisma.referralLink.findMany.mockResolvedValue([
        { id: 1, commissions: [{ amount: 5 }, { amount: 3 }] },
        { id: 2, commissions: [{ amount: 10 }] },
      ]);
      const result = await service.getStatsSummary(1);
      expect(result).toEqual({ totalLinks: 2, totalOrders: 3, totalCommission: 18 });
    });

    it('should return zeros when empty', async () => {
      prisma.referralLink.findMany.mockResolvedValue([]);
      expect(await service.getStatsSummary(1)).toEqual({ totalLinks: 0, totalOrders: 0, totalCommission: 0 });
    });
  });

  describe('getCommissions', () => {
    it('should return all for admin', async () => {
      prisma.commission.findMany.mockResolvedValue([{ id: 1 }]);
      expect(await service.getCommissions()).toHaveLength(1);
    });

    it('should filter by userId', async () => {
      prisma.commission.findMany.mockResolvedValue([]);
      await service.getCommissions(1);
      expect(prisma.commission.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { referralLink: { userId: 1 } } }));
    });
  });
});
