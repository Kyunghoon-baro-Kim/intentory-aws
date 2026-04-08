import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersService } from './orders.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;
  let payments: any;
  let referrals: any;

  beforeEach(() => {
    prisma = {
      order: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
      $transaction: vi.fn(),
    };
    payments = { processPayment: vi.fn() };
    referrals = { trackReferral: vi.fn() };
    service = new OrdersService(prisma, payments, referrals);
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
      payments.processPayment.mockResolvedValue({ success: true });

      const result = await service.create(1, [{ productId: 1, quantity: 2 }]);
      expect(result.gst).toBe(20);
      expect(result.total).toBe(220);
    });

    it('should track referral commission when referralCode provided', async () => {
      const order = { id: 1, userId: 1, subtotal: 100, gst: 10, total: 110, status: 'pending' };
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 10 }), update: vi.fn() },
          order: { create: vi.fn().mockResolvedValue(order) },
          orderItem: { create: vi.fn() },
        };
        return fn(tx);
      });
      payments.processPayment.mockResolvedValue({ success: true });
      referrals.trackReferral.mockResolvedValue({ id: 1, amount: 5.5 });

      await service.create(1, [{ productId: 1, quantity: 1 }], 'REF123');
      expect(referrals.trackReferral).toHaveBeenCalledWith('REF123', 1, 110, 1);
    });

    it('should not track referral when no referralCode', async () => {
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 10 }), update: vi.fn() },
          order: { create: vi.fn().mockResolvedValue({ id: 1, subtotal: 100, gst: 10, total: 110, status: 'pending' }) },
          orderItem: { create: vi.fn() },
        };
        return fn(tx);
      });
      payments.processPayment.mockResolvedValue({ success: true });

      await service.create(1, [{ productId: 1, quantity: 1 }]);
      expect(referrals.trackReferral).not.toHaveBeenCalled();
    });

    it('should throw on insufficient stock', async () => {
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = { product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 0 }) }, order: { create: vi.fn() }, orderItem: { create: vi.fn() } };
        return fn(tx);
      });
      await expect(service.create(1, [{ productId: 1, quantity: 5 }])).rejects.toThrow(BadRequestException);
    });

    it('should throw on payment failure', async () => {
      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = { product: { findUnique: vi.fn().mockResolvedValue({ id: 1, price: 100, stock: 10 }), update: vi.fn() }, order: { create: vi.fn() }, orderItem: { create: vi.fn() } };
        return fn(tx);
      });
      payments.processPayment.mockResolvedValue({ success: false });
      await expect(service.create(1, [{ productId: 1, quantity: 1 }])).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all orders for admin', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const result = await service.findAll(1, 'admin_a');
      expect(result).toHaveLength(2);
    });

    it('should return only user orders for customer', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 1 }]);
      await service.findAll(1, 'customer');
      expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 1 } }));
    });
  });

  describe('findById', () => {
    it('should return order with items', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 1, items: [{ productId: 1 }] });
      const result = await service.findById(1);
      expect(result.items).toHaveLength(1);
    });

    it('should throw NotFoundException', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      prisma.order.update.mockResolvedValue({ id: 1, status: 'processing' });
      const result = await service.updateStatus(1, 'processing');
      expect(result.status).toBe('processing');
    });
  });
});
