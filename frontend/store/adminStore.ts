import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin';
}

interface AdminState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,

      login: (token, admin) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('madar_admin_token', token);
        }
        set({
          token,
          admin,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('madar_admin_token');
          localStorage.removeItem('madar_admin_storage');
        }
        set({
          token: null,
          admin: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'madar_admin_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const formatPersianNumber = (num: number | string): string => {
  if (num === null || num === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export const formatPersianCurrency = (amount: number): string => {
  if (amount === undefined || amount === null) return '۰ تومان';
  const formatted = amount.toLocaleString('fa-IR');
  return `${formatted} تومان`;
};
