import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(() => {
    prisma = { user: { findUnique: vi.fn() } };
    service = new UsersService(prisma);
  });

  it('should find user by id and exclude password', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer', password: 'hashed' });
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
    expect(result).not.toHaveProperty('password');
  });

  it('should return null for non-existent user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await service.findById(999);
    expect(result).toBeNull();
  });

  it('should find user by email (includes password for internal use)', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer', password: 'hashed' });
    const result = await service.findByEmail('test@test.com');
    expect(result!.email).toBe('test@test.com');
    expect(result).toHaveProperty('password');
  });
});
