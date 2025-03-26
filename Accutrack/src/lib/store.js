'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSubscriptionStore = create(
  persist(
    (set) => ({
      isSubscribed: false,
      setSubscribed: (value) => set({ isSubscribed: value }),
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
