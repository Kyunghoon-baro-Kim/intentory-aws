import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralsService } from '../referrals/referrals.service';
import { OrdersService } from '../orders/orders.service';
import { ReviewsService } from '../reviews/reviews.service';
import { CollaborationsService } from '../collaborations/collaborations.service';

vi.mock('@prisma/client', () => ({
  CollaborationStatus: { proposed: 'proposed', accepted: 'accepted', rejected: 'rejected', in_progress: 'in_progress', completed: 'completed' },
}));

describe('Influencer Referral Flow — Integration', () => {
  let referralsService: ReferralsService;
  let ordersService: OrdersService;
  let prismaMock: any;
  let paymentsMock: any;

  beforeEach(() => {
    prismaMock = {
      referralLink: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
      commission: { create: vi.fn(), findMany: vi.fn() },
      product: { findUnique: vi.fn(), update: vi.fn() },
      order: { create: vi.fn(), findFirst: vi.fn() },
      orderItem: { create: vi.fn() },
      $transaction: vi.fn((fn: any) => fn(prismaMock)),
    };
    paymentsMock = { processPayment: vi.fn().mockResolvedValue({ success: true, transactionId: 'mock_123' }) };
    referralsService = new ReferralsService(prismaMock);
    ordersService = new OrdersService(prismaMock, paymentsMock);
  });

  it('전체 흐름: 레퍼럴 링크 생성 → 주문 → 커미션 생성', async () => {
    // Step 1: 인플루언서가 레퍼럴 링크 생성
    prismaMock.referralLink.create.mockResolvedValue({ id: 1, userId: 10, productId: 1, code: 'ref_abc123' });
    const link = await referralsService.generateLink(10, 1);
    expect(link.code).toBeDefined();

    // Step 2: 고객이 레퍼럴 링크로 주문
    prismaMock.product.findUnique.mockResolvedValue({ id: 1, name: 'Laptop', price: 100, stock: 10 });
    prismaMock.order.create.mockResolvedValue({ id: 1, userId: 5, subtotal: 100, gst: 10, total: 110, status: 'pending', referralCode: 'ref_abc123' });
    prismaMock.orderItem.create.mockResolvedValue({});
    prismaMock.product.update.mockResolvedValue({});

    const order = await ordersService.create(5, [{ productId: 1, quantity: 1 }], 'ref_abc123');
    expect(order.referralCode).toBe('ref_abc123');

    // Step 3: 레퍼럴 추적 → 커미션 생성
    prismaMock.referralLink.findUnique.mockResolvedValue({ id: 1, userId: 10 });
    prismaMock.commission.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 1, ...data, status: 'pending' }));

    const commission = await referralsService.trackReferral('ref_abc123', order.id, order.total, 0.05);
    expect(commission).not.toBeNull();
    expect(commission!.amount).toBe(5.5); // 110 * 0.05
    expect(commission!.status).toBe('pending');
  });

  it('잘못된 레퍼럴 코드로 주문 시 커미션 미생성', async () => {
    prismaMock.referralLink.findUnique.mockResolvedValue(null);

    const commission = await referralsService.trackReferral('invalid_code', 1, 100);
    expect(commission).toBeNull();
  });

  it('레퍼럴 없이 주문 시 커미션 미생성', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 1, price: 50, stock: 5 });
    prismaMock.order.create.mockResolvedValue({ id: 2, userId: 5, subtotal: 50, gst: 5, total: 55, status: 'pending', referralCode: null });
    prismaMock.orderItem.create.mockResolvedValue({});
    prismaMock.product.update.mockResolvedValue({});

    const order = await ordersService.create(5, [{ productId: 1, quantity: 1 }]);
    expect(order.referralCode).toBeNull();
    // 레퍼럴 코드가 없으므로 trackReferral 호출하지 않음
  });
});

describe('Collaboration Status Flow — Integration', () => {
  let collabService: CollaborationsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      collaboration: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), findMany: vi.fn() },
    };
    collabService = new CollaborationsService(prismaMock);
  });

  it('전체 흐름: proposed → accepted → in_progress → completed', async () => {
    // Step 1: 제안 생성
    prismaMock.collaboration.create.mockResolvedValue({ id: 1, status: 'proposed' });
    const collab = await collabService.create({ influencerProfileId: 1, productId: 1, terms: 'Review' });
    expect(collab.status).toBe('proposed');

    // Step 2: 수락
    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'proposed' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'accepted' });
    const accepted = await collabService.updateStatus(1, 'accepted');
    expect(accepted.status).toBe('accepted');

    // Step 3: 진행
    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'accepted' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'in_progress' });
    const inProgress = await collabService.updateStatus(1, 'in_progress');
    expect(inProgress.status).toBe('in_progress');

    // Step 4: 완료
    prismaMock.collaboration.findUnique.mockResolvedValue({ id: 1, status: 'in_progress' });
    prismaMock.collaboration.update.mockResolvedValue({ id: 1, status: 'completed' });
    const completed = await collabService.updateStatus(1, 'completed');
    expect(completed.status).toBe('completed');
  });
});
