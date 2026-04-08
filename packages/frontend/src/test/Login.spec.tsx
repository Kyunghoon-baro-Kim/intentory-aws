import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));

import Login from '../pages/Login';

describe('Login', () => {
  it('renders login form', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByTestId('login-title')).toHaveTextContent('Welcome Back');
    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toHaveTextContent('Login');
  });

  it('has link to register', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
