import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: any;

  beforeEach(() => {
    prisma = { product: { findMany: vi.fn() } };
    service = new InventoryService(prisma);
  });

  describe('getInventory', () => {
    it('should mark out_of_stock when stock is 0', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, name: 'A', stock: 0 }]);

      const result = await service.getInventory();
      expect(result[0].status).toBe('out_of_stock');
    });

    it('should mark low_stock when stock < 10', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, name: 'A', stock: 5 }]);

      const result = await service.getInventory();
      expect(result[0].status).toBe('low_stock');
    });

    it('should mark in_stock when stock >= 10', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, name: 'A', stock: 50 }]);

      const result = await service.getInventory();
      expect(result[0].status).toBe('in_stock');
    });
  });
});
