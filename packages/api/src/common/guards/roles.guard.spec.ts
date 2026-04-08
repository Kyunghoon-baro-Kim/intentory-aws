import { describe, it, expect, vi } from 'vitest';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  function mockContext(role: string | undefined, requiredRoles: string[] | undefined) {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles as any);
    return {
      getHandler: () => () => {},
      getClass: () => class {},
      switchToHttp: () => ({ getRequest: () => ({ user: role ? { role } : undefined }) }),
    } as any;
  }

  it('should allow when no roles required', () => {
    expect(guard.canActivate(mockContext('customer', undefined))).toBe(true);
  });

  it('should allow matching role', () => {
    expect(guard.canActivate(mockContext('admin_a', ['admin_a']))).toBe(true);
  });

  it('should deny non-matching role', () => {
    expect(guard.canActivate(mockContext('customer', ['admin_a']))).toBe(false);
  });

  it('should deny when no user', () => {
    expect(guard.canActivate(mockContext(undefined, ['admin_a']))).toBe(false);
  });
});
