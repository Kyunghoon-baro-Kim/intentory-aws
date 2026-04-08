import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralsService } from '../referrals/referrals.service';
import { OrdersService } from '../orders/orders.service';
import { CollaborationsService } from '../collaborations/collaborations.service';

vi.mock('@prisma/client', () => ({
  CollaborationStatus: { proposed: 'proposed', accepted: 'accepted', rejected: 'rejected', in_progress: 'in_progress', completed: 'completed' },
}));

describe('Influencer Referral Flow — Integration', () => {
  let referralsService: ReferralsService;
  let ordersService: OrdersService;
  let prismaMock: any;
  let paymentsMock: any;
  let referralsMock: any;

  beforeEach(() => {
    prismaMock = {
      referralLink: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() },
      commission: { create: vi.fn(), findMany: vi.fn() },
      product: { findUnique: vi.fn(), update: vi.fn() },
      order: { create: vi.fn(), findFirst: vi.fn() },
      orderItem: { create: vi.fn() },
      $transaction: vi.fn((fn: any) => fn(prismaMock)),
    };
    paymentsMock = { processPayment: vi.fn().mockResolvedValue({ success: true }) };
    referralsService = new ReferralsService(prismaMock);
    referralsMock = { trackReferral: vi.fn() };
    ordersService = new OrdersService(prismaMock, paymentsMock, referralsMock);
  });

  it('전체 흐름: 레퍼럴 링크 생성 → 주문 → 커미션 생성', async () => {
    prismaMock.referralLink.findFirst.mockResolvedValue(null);
    prismaMock.referralLink.create.mockResolvedValue({ id: 1, userId: 10, productId: 1, code: 'ref_abc123' });
    const link = await referralsService.generateLink(10, 1);
    expect(link.code).toBeDefined();

    prismaMock.product.findUnique.mockResolvedValue({ id: 1, price: 100, stock: 10 });
    prismaMock.order.create.mockResolvedValue({ id: 1, userId: 5, subtotal: 100, gst: 10, total: 110, status: 'pending', referralCode: 'ref_abc123' });
    prismaMock.orderItem.create.mockResolvedValue({});
    prismaMock.product.update.mockResolvedValue({});
    referralsMock.trackReferral.mockResolvedValue({ id: 1, amount: 5.5 });

    const order = await ordersService.create(5, [{ productId: 1, quantity: 1 }], 'ref_abc123');
    expect(order.referralCode).toBe('ref_abc123');
    expect(referralsMock.trackReferral).toHaveBeenCalledWith('ref_abc123', 1, 110, 5);
  });

  it('잘못된 레퍼럴 코드로 주문 시 커미션 미생성', async () => {
    prismaMock.referralLink.findUnique.mockResolvedValue(null);
    const commission = await referralsService.trackReferral('invalid_code', 1, 100, 5);
    expect(commission).toBeNull();
  });

  it('레퍼럴 없이 주문 시 커미션 미생성', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 1, price: 50, stock: 5 });
    prismaMock.order.create.mockResolvedValue({ id: 2, userId: 5, subtotal: 50, gst: 5, total: 55, status: 'pending', referralCode: null });
    prismaMock.orderItem.create.mockResolvedValue({});
    prismaMock.product.update.mockResolvedValue({});

    await ordersService.create(5, [{ productId: 1, quantity: 1 }]);
    expect(referralsMock.trackReferral).not.toHaveBeenCalled();
  });
});

describe('Collaboration Status Flow — Integration', () => {
  let collabService: CollaborationsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = { collaboration: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), findMany: vi.fn() } };
    collabService = new CollaborationsService(prismaMock);
  });

  it('전체 흐름: proposed → accepted → in_progress → completed', async () => {
    prismaMock.collaboration.create.mockResolvedValue({ id: 1, status: 'proposed' });
    const collab = await collabService.create({ influencerProfileId: 1, productId: 1, terms: 'Review' });
    expect(collab.status).toBe('proposed');

    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });
    expect((await collabService.updateStatus(1, 'accepted')).status).toBe('accepted');

    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'accepted' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'in_progress' });
    expect((await collabService.updateStatus(1, 'in_progress')).status).toBe('in_progress');

    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'in_progress' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'completed' });
    expect((await collabService.updateStatus(1, 'completed')).status).toBe('completed');
  });
});
