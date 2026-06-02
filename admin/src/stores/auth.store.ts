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
      name: "auth-store",
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


// const useAuthStore = create<AuthState>()((set) => ({
//   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwZmI1ZDVlLTcxYmEtNGZmYi1hMGZhLWY0NDYzMmVlYThjNiIsInJvbGUiOiJTVEFGRiIsImlhdCI6MTc4MDM1Njc4MCwiZXhwIjoxNzgwOTYxNTgwfQ.TOX2aU2qpiZkS37CKyUxAVCVLaNi2iu5SqQC3zh4vmI",
//   expireAt: "7d",
//   user: {
//     id: "90fb5d5e-71ba-4ffb-a0fa-f44632eea8c6",
//     email: "friday.joshua@speedlinkng.com",
//     name: "Admin Dept One",
//     roles: ["STAFF", "DEPARTMENT_ADMIN"],
//   },
//   isAuthenticated: true,
//   setAuth: (auth: Partial<AuthState>) => set((state) => ({ ...state, ...auth })),
//   clearAuth: () => set({ token: "", expireAt: "", user: null, isAuthenticated: false }),
// }));

// export default useAuthStore;
