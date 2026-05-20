import type { UserStoreType } from "@type/user.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            name: "",
            email: "",
            password: "",
            setUser: (user) => set(user),
            clearUser: () => set({ name: "", email: "", password: "" }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                name: state.name,
                email: state.email,
                password: state.password,
            }),
        }
    )
);

export default useUserStore;