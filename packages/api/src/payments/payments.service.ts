import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async processPayment(amount: number): Promise<{ success: boolean; transactionId: string }> {
    return { success: true, transactionId: `mock_${Date.now()}` };
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    return { success: true };
  }
}
