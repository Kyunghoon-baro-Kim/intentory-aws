import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

const COMMISSION_TRANSITIONS: Record<string, string[]> = {
  pending: ['approved'],
  approved: ['paid'],
  paid: [],
};

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async generateLink(userId: number, productId: number) {
    const existing = await this.prisma.referralLink.findFirst({ where: { userId, productId } });
    if (existing) throw new ConflictException('Referral link already exists for this product');
    const code = randomBytes(6).toString('hex');
    return this.prisma.referralLink.create({ data: { userId, productId, code } });
  }

  async trackReferral(referralCode: string, orderId: number, orderTotal: number, orderUserId: number, commissionRate = 0.05) {
    const link = await this.prisma.referralLink.findUnique({ where: { code: referralCode } });
    if (!link) return null;
    if (link.userId === orderUserId) return null; // 자기 참조 방지
    return this.prisma.commission.create({ data: { referralLinkId: link.id, orderId, amount: orderTotal * commissionRate } });
  }

  async updateCommissionStatus(id: number, newStatus: string) {
    const commission = await this.prisma.commission.findUnique({ where: { id } });
    if (!commission) throw new NotFoundException('Commission not found');
    const allowed = COMMISSION_TRANSITIONS[commission.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from '${commission.status}' to '${newStatus}'`);
    }
    return this.prisma.commission.update({ where: { id }, data: { status: newStatus as any } });
  }

  getStats(userId: number) {
    return this.prisma.referralLink.findMany({ where: { userId }, include: { commissions: true, product: { select: { name: true, price: true } } } });
  }

  async getStatsSummary(userId: number) {
    const links = await this.prisma.referralLink.findMany({ where: { userId }, include: { commissions: true } });
    const totalOrders = links.reduce((sum, l) => sum + l.commissions.length, 0);
    const totalCommission = links.reduce((sum, l) => sum + l.commissions.reduce((s, c) => s + c.amount, 0), 0);
    return { totalLinks: links.length, totalOrders, totalCommission };
  }

  getCommissions(userId?: number) {
    const where = userId ? { referralLink: { userId } } : {};
    return this.prisma.commission.findMany({ where, include: { referralLink: { include: { user: { select: { name: true } }, product: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
  }

  getMyLinks(userId: number) {
    return this.prisma.referralLink.findMany({ where: { userId }, include: { product: { select: { name: true, price: true } }, commissions: { select: { amount: true, status: true } } } });
  }
}
