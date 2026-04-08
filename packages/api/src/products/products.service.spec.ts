import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    service = new ProductsService(prisma);
  });

  describe('findAll', () => {
    it('should return products ordered by createdAt desc', async () => {
      const products = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      prisma.product.findMany.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(prisma.product.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const product = { id: 1, name: 'Test Product' };
      prisma.product.findUnique.mockResolvedValue(product);

      const result = await service.findById(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const data = { name: 'New', price: 100, stock: 10 };
      const created = { id: 1, ...data };
      prisma.product.create.mockResolvedValue(created);

      const result = await service.create(data);
      expect(result).toEqual(created);
      expect(prisma.product.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updated = { id: 1, name: 'Updated', price: 200, stock: 5 };
      prisma.product.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual(updated);
      expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'Updated' } });
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      prisma.product.delete.mockResolvedValue({ id: 1 });

      await service.delete(1);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
