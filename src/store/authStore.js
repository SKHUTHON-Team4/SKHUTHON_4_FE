import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: !!(localStorage.getItem('accessToken') || localStorage.getItem('token')),
  user: null,

  login: (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.removeItem('token');
    set({ isLoggedIn: true });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;
