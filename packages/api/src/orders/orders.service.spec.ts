import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersService } from './orders.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;
  let payments: any;

  beforeEach(() => {
    prisma = {
      order: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
      $transaction: vi.fn((fn) => fn({
        product: { findUnique: vi.fn(), update: vi.fn() },
        order: { create: vi.fn() },
        orderItem: { create: vi.fn() },
      })),
    };
    payments = { processPayment: vi.fn() };
    service = new OrdersService(prisma, payments);
  });

  describe('create', () => {
    it('should create order with GST calculation', async () => {
      const product = { id: 1, price: 100, stock: 10 };
      const order = { id: 1, userId: 1, subtotal: 200, gst: 20, total: 220, status: 'pending' };

      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: vi.fn().mockResolvedValue(product), update: vi.fn() },
          order: { create: vi.fn().mockResolvedValue(order) },
          orderItem: { create: vi.fn() },
        };
        return fn(tx);
      });
      payments.processPayment.mockResolvedValue({ success: true, transactionId: 'mock_123' });

      const result = await service.create(1, [{ productId: 1, quantity: 2 }]);
      expect(result.gst).toBe(20);
      expect(result.total).toBe(220);
    });

    it('should throw BadRequestException on insufficient stock', async () => {
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 0 }) },
          order: { create: vi.fn() },
          orderItem: { create: vi.fn() },
        };
        return fn(tx);
      });

      await expect(service.create(1, [{ productId: 1, quantity: 5 }])).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on payment failure', async () => {
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 10 }), update: vi.fn() },
          order: { create: vi.fn() },
          orderItem: { create: vi.fn() },
        };
        return fn(tx);
      });
      payments.processPayment.mockResolvedValue({ success: false });

      await expect(service.create(1, [{ productId: 1, quantity: 1 }])).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all orders for admin', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      prisma.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll(1, 'admin_a');
      expect(result).toEqual(orders);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });

    it('should return only user orders for customer', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 1 }]);

      await service.findAll(1, 'customer');
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1 } }),
      );
    });
  });

  describe('findById', () => {
    it('should return order with items', async () => {
      const order = { id: 1, items: [{ productId: 1 }] };
      prisma.order.findUnique.mockResolvedValue(order);

      const result = await service.findById(1);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException when order not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const updated = { id: 1, status: 'processing' };
      prisma.order.update.mockResolvedValue(updated);

      const result = await service.updateStatus(1, 'processing');
      expect(result.status).toBe('processing');
    });
  });
});
