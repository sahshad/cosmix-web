import { create } from 'zustand';

type User = {
  id: number;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  setUser: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));
