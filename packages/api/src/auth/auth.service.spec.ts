import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({ hash: vi.fn(), compare: vi.fn() }));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: JwtService;

  beforeEach(() => {
    prisma = { user: { findUnique: vi.fn(), create: vi.fn() } };
    jwt = { sign: vi.fn().mockReturnValue('mock-token') } as any;
    service = new AuthService(prisma, jwt);
  });

  describe('register', () => {
    it('should register a customer', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue('hashed');
      prisma.user.create.mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test', role: 'customer' });

      const result = await service.register({ email: 'test@test.com', password: 'password123', name: 'Test', role: 'customer' as any });
      expect(result.token).toBe('mock-token');
      expect(result.user.role).toBe('customer');
    });

    it('should reject admin registration via register', async () => {
      await expect(service.register({ email: 'a@a.com', password: 'pass1234', name: 'A', role: 'admin_a' as any }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should reject duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.register({ email: 'dup@test.com', password: 'pass1234', name: 'Dup', role: 'customer' as any }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed', name: 'Test', role: 'customer' });
      (bcrypt.compare as any).mockResolvedValue(true);

      const result = await service.login({ email: 'test@test.com', password: 'password123' });
      expect(result.token).toBe('mock-token');
    });

    it('should reject invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'bad@test.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createAdmin', () => {
    it('should create admin_b account', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue('hashed');
      prisma.user.create.mockResolvedValue({ id: 2, email: 'admin@test.com', name: 'Admin', role: 'admin_b' });

      const result = await service.createAdmin({ email: 'admin@test.com', password: 'pass1234', name: 'Admin', role: 'admin_b' as any });
      expect(result.role).toBe('admin_b');
    });

    it('should reject non-admin role', async () => {
      await expect(service.createAdmin({ email: 'a@a.com', password: 'pass1234', name: 'A', role: 'customer' as any }))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
