import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

import Layout from '../components/Layout';

describe('Layout', () => {
  it('shows login/register links when not logged in', () => {
    render(<MemoryRouter><Layout /></MemoryRouter>);
    expect(screen.getByTestId('navbar-login')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-register')).toBeInTheDocument();
  });

  it('shows logo', () => {
    render(<MemoryRouter><Layout /></MemoryRouter>);
    expect(screen.getByTestId('navbar-logo')).toHaveTextContent('Inventrix');
  });

  it('shows dark mode toggle', () => {
    render(<MemoryRouter><Layout /></MemoryRouter>);
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  });
});
