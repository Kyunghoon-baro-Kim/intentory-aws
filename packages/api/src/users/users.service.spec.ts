import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(() => {
    prisma = { user: { findUnique: vi.fn() } };
    service = new UsersService(prisma);
  });

  it('should find user by id', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return null for non-existent user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await service.findById(999);
    expect(result).toBeNull();
  });

  it('should find user by email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
    const result = await service.findByEmail('test@test.com');
    expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
  });
});
