import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import httpRequest from '../network/httpRequest';
import { toast } from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await httpRequest.post('/auth/login', {
            email,
            password,
          });

          if (response.data.success) {
            const { user, token } = response.data.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
            toast.success('Đăng nhập thành công!');
            return { success: true, data: { user, token } };
          }
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        toast.success('Đã đăng xuất thành công!');
      },

      checkAuth: () => {
        const { token } = get();
        if (token) {
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;
