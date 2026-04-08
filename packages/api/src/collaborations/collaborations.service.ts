import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CollaborationStatus } from '@prisma/client';

const VALID_TRANSITIONS: Record<string, string[]> = {
  proposed: ['accepted', 'rejected'],
  accepted: ['in_progress', 'rejected'],
  rejected: [],
  in_progress: ['completed'],
  completed: [],
};

const INFLUENCER_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  proposed: ['accepted', 'rejected'],
  accepted: ['rejected'],
};

@Injectable()
export class CollaborationsService {
  constructor(private prisma: PrismaService) {}

  create(data: { influencerProfileId: number; productId: number; terms: string; compensation?: string }) {
    return this.prisma.collaboration.create({ data });
  }

  async updateStatus(id: number, newStatus: string, userId?: number, userRole?: string) {
    const collab = await this.prisma.collaboration.findUnique({ where: { id }, include: { influencerProfile: true } });
    if (!collab) throw new NotFoundException('Collaboration not found');

    const allowed = VALID_TRANSITIONS[collab.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from '${collab.status}' to '${newStatus}'`);
    }

    if (userRole === 'influencer') {
      if (collab.influencerProfile.userId !== userId) throw new ForbiddenException('Not your collaboration');
      const influencerAllowed = INFLUENCER_ALLOWED_TRANSITIONS[collab.status] || [];
      if (!influencerAllowed.includes(newStatus)) {
        throw new ForbiddenException(`Influencer cannot transition to '${newStatus}'`);
      }
    }

    return this.prisma.collaboration.update({ where: { id }, data: { status: newStatus as CollaborationStatus } });
  }

  async findById(id: number) {
    const collab = await this.prisma.collaboration.findUnique({
      where: { id },
      include: { product: true, influencerProfile: { include: { user: { select: { name: true, email: true } } } } },
    });
    if (!collab) throw new NotFoundException('Collaboration not found');
    return collab;
  }

  async findByInfluencerUserId(userId: number) {
    const profile = await this.prisma.influencerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Influencer profile not found');
    return this.prisma.collaboration.findMany({ where: { influencerProfileId: profile.id }, include: { product: true }, orderBy: { createdAt: 'desc' } });
  }

  findAll() {
    return this.prisma.collaboration.findMany({ include: { product: true, influencerProfile: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
  }
}
