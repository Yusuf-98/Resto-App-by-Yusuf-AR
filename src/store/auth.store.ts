'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

// --- Remember Me Storage ---
// true (default) = persist across browser restarts (localStorage)
// false = persist only for the current tab session (sessionStorage)
let persistAcrossRestarts = true;

export function setRememberMe(value: boolean) {
  persistAcrossRestarts = value;
}

const rememberAwareStorage = createJSONStorage(() => ({
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    if (persistAcrossRestarts) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, value);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
}));

// --- Auth Store Types ---
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

// --- Auth Store ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // --- Hydration Flag ---
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      // --- Set Auth ---
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      // --- Update User ---
      setUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : (user as User),
        })),

      // --- Logout ---
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'foody_auth',
      storage: rememberAwareStorage,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
