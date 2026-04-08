import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({ compare: vi.fn(), hash: vi.fn() }));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    };
    service = new UsersService(prisma);
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer', password: 'hashed' });
      const result = await service.findById(1);
      expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      expect(await service.findById(999)).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user with password for internal use', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed' });
      const result = await service.findByEmail('test@test.com');
      expect(result).toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 1, email: 'a@a.com', name: 'A', role: 'customer', password: 'h1' },
        { id: 2, email: 'b@b.com', name: 'B', role: 'admin_a', password: 'h2' },
      ]);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      result.forEach((u: any) => expect(u).not.toHaveProperty('password'));
    });
  });

  describe('changePassword', () => {
    it('should change password with valid current password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'old_hashed' });
      (bcrypt.compare as any).mockResolvedValue(true);
      (bcrypt.hash as any).mockResolvedValue('new_hashed');
      prisma.user.update.mockResolvedValue({});

      const result = await service.changePassword(1, 'oldpass', 'newpass123');
      expect(result.message).toBe('Password changed successfully');
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { password: 'new_hashed' } });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.changePassword(999, 'old', 'new12345')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException for wrong current password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
      (bcrypt.compare as any).mockResolvedValue(false);
      await expect(service.changePassword(1, 'wrong', 'new12345')).rejects.toThrow(UnauthorizedException);
    });
  });
});
