import { create } from "zustand";

interface SidebarStore {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export const sidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    setIsCollapsed: (value) => set({ isCollapsed: value }),
}));
