import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(() => {
    service = new PaymentsService();
  });

  describe('processPayment', () => {
    it('should return success with transactionId', async () => {
      const result = await service.processPayment(100);
      expect(result.success).toBe(true);
      expect(result.transactionId).toMatch(/^mock_/);
    });
  });

  describe('refund', () => {
    it('should return success', async () => {
      const result = await service.refund('mock_123');
      expect(result.success).toBe(true);
    });
  });
});
