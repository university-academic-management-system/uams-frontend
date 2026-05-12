import type { AuthState } from "@type/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "",
            refreshToken: "",
            expireAt: "",
            setAuth: (auth) => set(auth),
            clearAuth: () => set({ token: "", refreshToken: "", expireAt: "" }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                expireAt: state.expireAt,
            }),
        }
    )
);

export default useAuthStore;