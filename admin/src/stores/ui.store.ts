import { create } from "zustand";

interface SidebarStore {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    setIsCollapsed: (value) => set({ isCollapsed: value }),
}));
