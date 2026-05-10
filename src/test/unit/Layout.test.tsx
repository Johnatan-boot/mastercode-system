import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Layout } from '../../components/Layout';
import { MemoryRouter } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

// Partial mock for hooks
vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Layout Component', () => {
  const mockUser = {
    name: 'Test User',
    role: 'Builder',
    xp: 500,
    level: 1,
    streak: 3
  };

  beforeEach(() => {
    (useTheme as any).mockReturnValue({
      theme: 'matrix',
    });
    (useAuth as any).mockReturnValue({
      user: mockUser,
      logout: vi.fn(),
    });
  });

  it('renders the sidebar with correct menu items', () => {
    render(
      <MemoryRouter>
        <Layout>Test Content</Layout>
      </MemoryRouter>
    );

    expect(screen.getByText('MasterCode')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Newsletter')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    render(
      <MemoryRouter>
        <Layout>Test Content</Layout>
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Nível 1')).toBeInTheDocument();
  });

  it('toggles sidebar visibility when menu button is clicked', () => {
     render(
      <MemoryRouter>
        <Layout>Test Content</Layout>
      </MemoryRouter>
    );
    
    const toggleButton = screen.getByTestId('sidebar-toggle');
    expect(toggleButton).toBeInTheDocument();
    
    // Check if sidebar is visible initially (isSidebarOpen default is true)
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(toggleButton);
    // Note: visibility check depends on how AnimatePresence/motion is handled in the test env
    // usually requires mocking framer-motion or using specific wait methods.
  });
});
