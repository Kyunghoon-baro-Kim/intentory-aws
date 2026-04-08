import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InfluencerService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: number, data: { channelUrl: string; subscribers: number; category: string; bio?: string }) {
    const existing = await this.prisma.influencerProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Profile already exists');
    return this.prisma.influencerProfile.create({ data: { userId, ...data } });
  }

  async updateProfile(userId: number, data: { channelUrl?: string; subscribers?: number; category?: string; bio?: string }) {
    const profile = await this.prisma.influencerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return this.prisma.influencerProfile.update({ where: { userId }, data });
  }

  async toggleVisibility(userId: number) {
    const profile = await this.prisma.influencerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return this.prisma.influencerProfile.update({ where: { userId }, data: { isPublic: !profile.isPublic } });
  }

  async getProfileWithStats(userId: number) {
    const profile = await this.prisma.influencerProfile.findUnique({
      where: { userId },
      include: { collaborations: { select: { id: true, status: true } }, user: { select: { name: true, email: true, referralLinks: { include: { commissions: true } } } } },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    const totalCollabs = profile.collaborations.length;
    const activeCollabs = profile.collaborations.filter(c => !['completed', 'rejected'].includes(c.status)).length;
    const links = profile.user.referralLinks;
    const totalCommission = links.reduce((sum, l) => sum + l.commissions.reduce((s, c) => s + c.amount, 0), 0);
    return { ...profile, stats: { totalCollabs, activeCollabs, totalReferralLinks: links.length, totalCommission } };
  }

  findAll() { return this.prisma.influencerProfile.findMany({ where: { isPublic: true }, include: { user: { select: { name: true, email: true } } } }); }

  findByUserId(userId: number) { return this.prisma.influencerProfile.findUnique({ where: { userId } }); }
}
