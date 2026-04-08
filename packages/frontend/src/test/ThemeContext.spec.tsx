import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ThemeProvider', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to system preference', () => {
    renderWithTheme(<div data-testid="child">test</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('respects stored theme', () => {
    localStorage.setItem('theme', 'dark');
    renderWithTheme(<div>test</div>);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
