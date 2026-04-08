import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const fetchMock = vi.fn();
global.fetch = fetchMock;

import Storefront from '../pages/Storefront';

describe('Storefront', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      json: () => Promise.resolve([
        { id: 1, name: 'Test Product', description: 'Desc', price: 99.99, stock: 10, imageUrl: '/images/test.png' },
        { id: 2, name: 'Another Product', description: 'Desc2', price: 49.99, stock: 0, imageUrl: null },
      ]),
    });
  });

  it('renders title', () => {
    render(<MemoryRouter><Storefront /></MemoryRouter>);
    expect(screen.getByTestId('storefront-title')).toHaveTextContent('Featured Products');
  });

  it('renders product cards after fetch', async () => {
    render(<MemoryRouter><Storefront /></MemoryRouter>);
    expect(await screen.findByTestId('product-card-1')).toBeInTheDocument();
    expect(await screen.findByTestId('product-card-2')).toBeInTheDocument();
  });

  it('shows out of stock badge', async () => {
    render(<MemoryRouter><Storefront /></MemoryRouter>);
    expect(await screen.findByText('Out of stock')).toBeInTheDocument();
  });
});
