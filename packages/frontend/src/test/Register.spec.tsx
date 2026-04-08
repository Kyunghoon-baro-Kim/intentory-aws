import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, token: null, login: vi.fn(), register: vi.fn(), logout: vi.fn() }),
}));

import Register from '../pages/Register';

describe('Register', () => {
  it('renders register form with role tabs', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    expect(screen.getByTestId('register-title')).toHaveTextContent('Join Inventrix');
    expect(screen.getByTestId('register-tab-customer')).toBeInTheDocument();
    expect(screen.getByTestId('register-tab-influencer')).toBeInTheDocument();
  });

  it('switches role tab', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.click(screen.getByTestId('register-tab-influencer'));
    expect(screen.getByTestId('register-submit')).toHaveTextContent('Register as Influencer');
  });

  it('defaults to customer tab', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    expect(screen.getByTestId('register-submit')).toHaveTextContent('Register as Customer');
  });
});
