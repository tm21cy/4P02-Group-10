'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      subscriptions: {}, // Map of userIds to subscription status
      setSubscribed: (userId, value) => 
        set((state) => ({
          subscriptions: {
            ...state.subscriptions,
            [userId]: value
          }
        })),
      isSubscribed: (userId) => {
        const state = get();
        return state.subscriptions[userId] || false;
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
