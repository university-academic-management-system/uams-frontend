import { create } from "zustand";

interface UiStore {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export const sidebarStore = create<UiStore>((set) => ({
    isCollapsed: false,
    setIsCollapsed: (value) => set({ isCollapsed: value }),
}));
