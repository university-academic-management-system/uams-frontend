import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "",
            expiresIn: "",
            user: null,
            isAuthenticated: false,
            setAuth: (auth) => set((state) => ({ ...state, ...auth })),
            clearAuth: () => set({ 
                token: "", 
                expiresIn: "",
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                expiresIn: state.expiresIn,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;