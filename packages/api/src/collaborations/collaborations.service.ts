import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationsService {
  constructor(private prisma: PrismaService) {}

  create(data: { influencerProfileId: number; productId: number; terms: string; compensation?: string }) {
    return this.prisma.collaboration.create({ data });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.collaboration.update({ where: { id }, data: { status: status as any } });
  }

  findByInfluencer(influencerProfileId: number) {
    return this.prisma.collaboration.findMany({ where: { influencerProfileId }, include: { product: true }, orderBy: { createdAt: 'desc' } });
  }

  findAll() {
    return this.prisma.collaboration.findMany({ include: { product: true, influencerProfile: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
  }
}
