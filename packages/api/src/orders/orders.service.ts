import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private payments: PaymentsService) {}

  async create(userId: number, items: { productId: number; quantity: number }[], referralCode?: string) {
    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const updates: { id: number; qty: number; price: number }[] = [];
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
        subtotal += product.price * item.quantity;
        updates.push({ id: item.productId, qty: item.quantity, price: product.price });
      }
      const gst = subtotal * 0.1;
      const total = subtotal + gst;
      const payment = await this.payments.processPayment(total);
      if (!payment.success) throw new BadRequestException('Payment failed');
      const order = await tx.order.create({ data: { userId, subtotal, gst, total, status: 'pending', referralCode } });
      for (const u of updates) {
        await tx.orderItem.create({ data: { orderId: order.id, productId: u.id, quantity: u.qty, price: u.price } });
        await tx.product.update({ where: { id: u.id }, data: { stock: { decrement: u.qty } } });
      }
      return order;
    });
  }

  findAll(userId: number, role: string) {
    if (role === 'admin_a' || role === 'admin_b') {
      return this.prisma.order.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
    }
    return this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } } });
    return order;
  }

  updateStatus(id: number, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status: status as any } });
  }
}
