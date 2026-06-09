import { create } from "zustand";

interface SidebarStore {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    pageTitle: string;
    setPageTitle: (value: string) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    setIsCollapsed: (value) => set({ isCollapsed: value }),
    pageTitle: "",
    setPageTitle: (value) => set({ pageTitle: value }),
}));
