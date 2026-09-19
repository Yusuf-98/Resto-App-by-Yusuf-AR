import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '@/store/auth.store';
import * as authApi from '@/lib/api/auth';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

function resetAuthStore() {
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthStore();
  });

  it('shows validation errors instead of submitting when the form is empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchTab={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email tidak valid')).toBeInTheDocument();
    expect(
      screen.getByText('Password minimal 6 karakter')
    ).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('toggles the password field between hidden and visible text', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchTab={() => {}} />);

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: '' }));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('logs the user in and redirects home on a successful submit', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      data: {
        token: 'token-123',
        user: {
          id: '1',
          name: 'Yusuf',
          email: 'yusuf@example.com',
          phone: '081234567890',
        },
      },
    });

    const user = userEvent.setup();
    render(<LoginForm onSwitchTab={() => {}} />);

    await user.type(screen.getByPlaceholderText('Email'), 'yusuf@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'yusuf@example.com',
        password: 'secret1',
      });
    });
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(useAuthStore.getState().token).toBe('token-123');
    expect(push).toHaveBeenCalledWith('/');
  });

  it('does not navigate and leaves the user logged out when the API rejects the login', async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      response: { data: { message: 'Email atau password salah' } },
    });

    const user = userEvent.setup();
    render(<LoginForm onSwitchTab={() => {}} />);

    await user.type(screen.getByPlaceholderText('Email'), 'yusuf@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(authApi.login).toHaveBeenCalled());
    expect(push).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
