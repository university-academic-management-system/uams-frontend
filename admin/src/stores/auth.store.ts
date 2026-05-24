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
            setAuth: (auth) => set((state) => ({ 
                ...state, 
                ...auth,
                isAuthenticated: auth.token !== undefined ? !!auth.token : state.isAuthenticated
            })),
            clearAuth: () => set({ 
                token: "", 
                expireAt: "",
                user: null,
                isAuthenticated: false
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
        }
    )
);

export default useAuthStore;