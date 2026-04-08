import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } }); }
  findById(id: number) { return this.prisma.product.findUnique({ where: { id } }); }
  create(data: { name: string; description?: string; price: number; stock: number; imageUrl?: string }) {
    return this.prisma.product.create({ data });
  }
  update(id: number, data: { name?: string; description?: string; price?: number; stock?: number; imageUrl?: string }) {
    return this.prisma.product.update({ where: { id }, data });
  }
  delete(id: number) { return this.prisma.product.delete({ where: { id } }); }
}
