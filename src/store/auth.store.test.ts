import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, setRememberMe } from './auth.store';
import type { User } from '@/types';

const user: User = {
  id: '1',
  name: 'Yusuf',
  email: 'yusuf@example.com',
  phone: '081234567890',
};

function resetStore() {
  useAuthStore.setState({
    token: null,
    user: null,
    isAuthenticated: false,
  });
  localStorage.clear();
  sessionStorage.clear();
  setRememberMe(true);
}

describe('useAuthStore', () => {
  beforeEach(resetStore);

  it('setAuth stores the token, user, and marks the session authenticated', () => {
    useAuthStore.getState().setAuth('token-123', user);
    const state = useAuthStore.getState();
    expect(state.token).toBe('token-123');
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser merges partial fields into the existing user instead of replacing it', () => {
    useAuthStore.getState().setAuth('token-123', user);
    useAuthStore.getState().setUser({ address: '123 Main St' });

    const state = useAuthStore.getState();
    // fields already present must survive the merge
    expect(state.user?.name).toBe('Yusuf');
    expect(state.user?.email).toBe('yusuf@example.com');
    // new field must be applied
    expect(state.user?.address).toBe('123 Main St');
  });

  it('setUser does not wipe an existing field when the update omits it', () => {
    useAuthStore.getState().setAuth('token-123', user);
    useAuthStore.getState().setUser({ address: '123 Main St' });
    // simulate a profile refetch that returns no `address` field at all
    useAuthStore.getState().setUser({ name: 'Yusuf Updated' });

    expect(useAuthStore.getState().user?.address).toBe('123 Main St');
    expect(useAuthStore.getState().user?.name).toBe('Yusuf Updated');
  });

  it('logout clears the token, user, and authenticated flag', () => {
    useAuthStore.getState().setAuth('token-123', user);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('persists to localStorage and clears sessionStorage when Remember Me is on', () => {
    setRememberMe(true);
    useAuthStore.getState().setAuth('token-123', user);

    expect(localStorage.getItem('foody_auth')).toContain('token-123');
    expect(sessionStorage.getItem('foody_auth')).toBeNull();
  });

  it('persists to sessionStorage and clears localStorage when Remember Me is off', () => {
    setRememberMe(false);
    useAuthStore.getState().setAuth('token-123', user);

    expect(sessionStorage.getItem('foody_auth')).toContain('token-123');
    expect(localStorage.getItem('foody_auth')).toBeNull();
  });
});
