// @stores/auth.store.ts
import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "",
            expireAt: "",
            user: undefined,
            setAuth: (auth) => set((state) => ({ ...state, ...auth })),
            clearAuth: () => set({ 
                token: "", 
                expireAt: "",
                user: undefined 
            }),
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                expireAt: state.expireAt,
                user: state.user,
            }),
        }
    )
);

export default useAuthStore;