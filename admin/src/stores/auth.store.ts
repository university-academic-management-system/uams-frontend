import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      expireAt: "",
      user: null,
      isAuthenticated: false,
      setAuth: (auth: Partial<AuthState>) =>
        set((state) => {
          const merged = { ...state, ...auth } as AuthState;

          // If token is not provided in the update, preserve current authentication state
          if (auth.token === undefined) {
            merged.isAuthenticated = state.isAuthenticated;
            return merged;
          }

          // Simply authenticate based on whether the token exists
          merged.isAuthenticated = !!auth.token;
          return merged;
        }),
        
      clearAuth: () =>
        set({
          token: "",
          expireAt: "",
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        expireAt: state.expireAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState: unknown, currentState) => {
        const state = persistedState as Partial<AuthState>;
        return {
          ...currentState,
          ...state,
          isAuthenticated: !!state?.token,
        };
      },
    },
  ),
);

export default useAuthStore;
