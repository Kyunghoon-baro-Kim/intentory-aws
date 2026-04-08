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

  findAll() { return this.prisma.influencerProfile.findMany({ where: { isPublic: true }, include: { user: { select: { name: true, email: true } } } }); }

  findByUserId(userId: number) { return this.prisma.influencerProfile.findUnique({ where: { userId } }); }
}
