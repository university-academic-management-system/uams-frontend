import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  _hasHydrated: boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: true, // Default to collapsed
      _hasHydrated: false,
      toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
