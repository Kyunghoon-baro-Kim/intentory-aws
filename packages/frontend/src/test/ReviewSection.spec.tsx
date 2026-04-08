import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 3, email: 'c@test.com', name: 'Customer', role: 'customer' }, token: 'test-token' }),
}));

const fetchMock = vi.fn();
global.fetch = fetchMock;

import ReviewSection from '../components/ReviewSection';

describe('ReviewSection', () => {
  it('renders review form for customer', async () => {
    fetchMock.mockResolvedValue({ json: () => Promise.resolve([]) });
    render(<ReviewSection productId={1} />);
    expect(await screen.findByTestId('review-form')).toBeInTheDocument();
    expect(screen.getByTestId('review-comment')).toBeInTheDocument();
    expect(screen.getByTestId('review-submit')).toHaveTextContent('Submit Review');
  });

  it('renders star buttons', async () => {
    fetchMock.mockResolvedValue({ json: () => Promise.resolve([]) });
    render(<ReviewSection productId={1} />);
    expect(await screen.findByTestId('review-star-1')).toBeInTheDocument();
    expect(screen.getByTestId('review-star-5')).toBeInTheDocument();
  });
});
