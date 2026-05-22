import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const sidebarStore = create<{
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}>()(persist((set) => ({
    isCollapsed: false,
    setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
}),{
    name: "sidebar-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
        isCollapsed: state.isCollapsed,
    }),
}))