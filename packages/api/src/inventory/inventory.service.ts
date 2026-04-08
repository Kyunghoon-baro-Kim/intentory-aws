import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getInventory() {
    const products = await this.prisma.product.findMany({ orderBy: { stock: 'asc' } });
    return products.map(p => ({
      ...p,
      status: p.stock === 0 ? 'out_of_stock' : p.stock < 10 ? 'low_stock' : 'in_stock',
    }));
  }
}
