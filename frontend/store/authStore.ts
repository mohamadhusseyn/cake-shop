import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, token: string, userDetails?: Partial<User>) => void;
  logout: () => void;
  updateProfile: (details: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (phone, token, userDetails = {}) => {
        set({
          token,
          isAuthenticated: true,
          user: {
            phone,
            fullName: userDetails.fullName || 'کاربر مهمان',
            city: userDetails.city || 'آبادان',
            address: userDetails.address || '',
            postalCode: userDetails.postalCode || '',
          },
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (details) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...details } : null,
        }));
      },
    }),
    {
      name: 'madar_auth_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
