import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async generateLink(userId: number, productId: number) {
    const code = randomBytes(6).toString('hex');
    return this.prisma.referralLink.create({ data: { userId, productId, code } });
  }

  async trackReferral(referralCode: string, orderId: number, orderTotal: number, commissionRate = 0.05) {
    const link = await this.prisma.referralLink.findUnique({ where: { code: referralCode } });
    if (!link) return null;
    return this.prisma.commission.create({ data: { referralLinkId: link.id, orderId, amount: orderTotal * commissionRate } });
  }

  getStats(userId: number) {
    return this.prisma.referralLink.findMany({ where: { userId }, include: { commissions: true } });
  }

  getCommissions(userId?: number) {
    const where = userId ? { referralLink: { userId } } : {};
    return this.prisma.commission.findMany({ where, include: { referralLink: { include: { user: { select: { name: true } }, product: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
  }

  getMyLinks(userId: number) {
    return this.prisma.referralLink.findMany({ where: { userId }, include: { product: { select: { name: true } } } });
  }
}
