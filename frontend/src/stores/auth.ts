import { defineStore } from 'pinia';
import { api } from '../boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        console.log('About to call api.post with username and password:', username, password);
        const response = await api.post('/api/token/', { username, password });
        console.log('Response from api.post:', response);
        this.accessToken = response.data.access;
        console.log('this.accessToken:', this.accessToken);
        this.refreshToken = response.data.refresh;
        console.log('this.refreshToken:', this.refreshToken);
        localStorage.setItem('access_token', this.accessToken as string);
        localStorage.setItem('refresh_token', this.refreshToken as string);
        // Optionally, fetch and set user data here
      } catch (error) {
        throw new Error('Login failed', error as Error);
      }
    },
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    async refreshAccessToken() {
      try {
        const response = await api.post('/api/token/refresh/', { refresh: this.refreshToken });
        this.accessToken = response.data.access;
        localStorage.setItem('access_token', this.accessToken as string);
      } catch (error) {
        this.logout();
        throw new Error('Session expired. Please log in again.', error as Error);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
});