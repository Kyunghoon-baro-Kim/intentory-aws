import { describe, it, expect } from 'vitest';
import { HttpExceptionFilterImpl } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilterImpl();

  function mockHost(statusFn: (s: number) => any) {
    return {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusFn }),
        getRequest: () => ({ url: '/test' }),
      }),
    } as any;
  }

  it('should format HttpException response', () => {
    let captured: any;
    const host = mockHost((s: number) => ({ json: (body: any) => { captured = { status: s, body }; } }));

    filter.catch(new HttpException('Not found', HttpStatus.NOT_FOUND), host);
    expect(captured.status).toBe(404);
    expect(captured.body.message).toBe('Not found');
    expect(captured.body.statusCode).toBe(404);
    expect(captured.body.timestamp).toBeDefined();
  });

  it('should handle unknown errors as 500', () => {
    let captured: any;
    const host = mockHost((s: number) => ({ json: (body: any) => { captured = { status: s, body }; } }));

    filter.catch(new Error('unexpected'), host);
    expect(captured.status).toBe(500);
    expect(captured.body.message).toBe('Internal server error');
  });
});
