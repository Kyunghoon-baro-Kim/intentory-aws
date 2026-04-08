import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(() => {
    authService = {
      register: vi.fn(),
      login: vi.fn(),
      createAdmin: vi.fn(),
    };
    controller = new AuthController(authService);
  });

  it('should call register', async () => {
    const dto = { email: 'test@test.com', password: 'pass1234', name: 'Test', role: 'customer' as any };
    authService.register.mockResolvedValue({ token: 'jwt', user: { id: 1 } });
    const result = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result.token).toBe('jwt');
  });

  it('should call login', async () => {
    const dto = { email: 'test@test.com', password: 'pass1234' };
    authService.login.mockResolvedValue({ token: 'jwt', user: { id: 1 } });
    const result = await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result.token).toBe('jwt');
  });

  it('should call createAdmin', async () => {
    const dto = { email: 'admin@test.com', password: 'pass1234', name: 'Admin', role: 'admin_b' as any };
    authService.createAdmin.mockResolvedValue({ id: 2, role: 'admin_b' });
    const result = await controller.createAdmin(dto);
    expect(authService.createAdmin).toHaveBeenCalledWith(dto);
    expect(result.role).toBe('admin_b');
  });

  it('should return user from me endpoint', () => {
    const user = { id: 1, email: 'test@test.com', role: 'customer', name: 'Test' };
    const result = controller.me(user);
    expect(result).toEqual(user);
  });
});
