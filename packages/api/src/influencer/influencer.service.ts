import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InfluencerService {
  constructor(private prisma: PrismaService) {}

  createProfile(userId: number, data: { channelUrl: string; subscribers: number; category: string; bio?: string }) {
    return this.prisma.influencerProfile.create({ data: { userId, ...data } });
  }

  updateProfile(userId: number, data: { channelUrl?: string; subscribers?: number; category?: string; bio?: string }) {
    return this.prisma.influencerProfile.update({ where: { userId }, data });
  }

  findAll() { return this.prisma.influencerProfile.findMany({ where: { isPublic: true }, include: { user: { select: { name: true, email: true } } } }); }

  findByUserId(userId: number) { return this.prisma.influencerProfile.findUnique({ where: { userId } }); }
}
