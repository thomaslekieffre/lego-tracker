import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LegoSetStatus } from '@/types/database';

interface SetPreferences {
  lastUsedStatus: Record<string, LegoSetStatus>;
  defaultStatus: LegoSetStatus;
  updateLastUsedStatus: (setId: string, status: LegoSetStatus) => void;
  setDefaultStatus: (status: LegoSetStatus) => void;
}

export const useSetPreferences = create<SetPreferences>()(
  persist(
    (set) => ({
      lastUsedStatus: {},
      defaultStatus: 'dismounted',
      updateLastUsedStatus: (setId, status) =>
        set((state) => ({
          lastUsedStatus: { ...state.lastUsedStatus, [setId]: status },
        })),
      setDefaultStatus: (status) =>
        set(() => ({
          defaultStatus: status,
        })),
    }),
    {
      name: 'set-preferences',
    }
  )
);
