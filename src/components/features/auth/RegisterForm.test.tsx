import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';
import { useAuthStore } from '@/store/auth.store';
import * as authApi from '@/lib/api/auth';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/lib/api/auth', () => ({
  register: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

function resetAuthStore() {
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
}

async function fillValidFormExceptPasswords(
  user: ReturnType<typeof userEvent.setup>
) {
  await user.type(screen.getByPlaceholderText('Name'), 'Yusuf');
  await user.type(screen.getByPlaceholderText('Email'), 'yusuf@example.com');
  await user.type(screen.getByPlaceholderText('Number Phone'), '081234567890');
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthStore();
  });

  it('rejects submission when confirm password does not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchTab={() => {}} />);

    await fillValidFormExceptPasswords(user);
    await user.type(screen.getByPlaceholderText('Password'), 'secret1');
    await user.type(
      screen.getByPlaceholderText('Confirm Password'),
      'different'
    );
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(
      await screen.findByText('Konfirmasi password tidak cocok')
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it('rejects a phone number that is too short', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchTab={() => {}} />);

    await user.type(screen.getByPlaceholderText('Name'), 'Yusuf');
    await user.type(screen.getByPlaceholderText('Email'), 'yusuf@example.com');
    await user.type(screen.getByPlaceholderText('Number Phone'), '123');
    await user.type(screen.getByPlaceholderText('Password'), 'secret1');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(
      await screen.findByText('Nomor HP minimal 10 digit')
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it('registers the user and redirects home on a valid submit', async () => {
    vi.mocked(authApi.register).mockResolvedValue({
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
    render(<RegisterForm onSwitchTab={() => {}} />);

    await fillValidFormExceptPasswords(user);
    await user.type(screen.getByPlaceholderText('Password'), 'secret1');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        name: 'Yusuf',
        email: 'yusuf@example.com',
        phone: '081234567890',
        password: 'secret1',
      });
    });
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
    expect(push).toHaveBeenCalledWith('/');
  });
});
