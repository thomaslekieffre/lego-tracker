import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DisplaySettings {
  isCompactView: boolean;
  hasAnimations: boolean;
  setCompactView: (isCompact: boolean) => void;
  setAnimations: (hasAnimations: boolean) => void;
}

export const useDisplaySettings = create<DisplaySettings>()(
  persist(
    (set) => ({
      isCompactView: false,
      hasAnimations: true,
      setCompactView: (isCompact) => set({ isCompactView: isCompact }),
      setAnimations: (hasAnimations) => set({ hasAnimations }),
    }),
    {
      name: 'display-settings',
    }
  )
);
