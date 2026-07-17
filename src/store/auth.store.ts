// import { User } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  // user: Partial<User> | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  // setUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  setIsAuthenticated: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    // user: null,
    isAuthenticated: false,
    token: null,
    isLoading: false,

    // setUser: (newUser) => {
    //   set((state) => ({
    //     user: {
    //       ...state.user,
    //       ...Object.fromEntries(
    //         Object.entries(newUser).filter(([_, v]) => v !== null && v !== undefined)
    //       ),
    //     },
    //   }));
    // },
    setToken: (token) => set({ token }),
    setIsAuthenticated: (v: boolean) => set({ isAuthenticated: v }),
    setLoading: (v: boolean) => set({ isLoading: v }),
    // getUser: () => useAuthStore((state) => state.user),

    logout: () =>
      set({
        // user: null,
        token: null,
        isAuthenticated: false,
      }),
  }),
    {
      name: "auth-store",
    }
  )
);