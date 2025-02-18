import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LegoSetStatus } from '@/types/database';

interface SetPreferences {
  lastUsedStatus: Record<string, LegoSetStatus>;
  updateLastUsedStatus: (setId: string, status: LegoSetStatus) => void;
}

export const useSetPreferences = create<SetPreferences>()(
  persist(
    (set) => ({
      lastUsedStatus: {},
      updateLastUsedStatus: (setId, status) =>
        set((state) => ({
          lastUsedStatus: { ...state.lastUsedStatus, [setId]: status },
        })),
    }),
    {
      name: 'set-preferences',
    }
  )
);
