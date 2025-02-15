import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import log from '../services/logger';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    username: localStorage.getItem('username') || null,
    first_name: localStorage.getItem('first_name') || null,
    last_name: localStorage.getItem('last_name') || null,
    email: localStorage.getItem('email') || null,
  }),

  actions: {
    /**
     * Logs in the user with the provided username and password.
     * 
     * This method sends a POST request to the `/api/token/` endpoint with the
     * username and password, and stores the received access and refresh tokens
     * in the local storage. It then calls the `profile()` method to fetch and
     * store the user's profile information.
     * 
     * @param username - The username of the user to log in.
     * @param password - The password of the user to log in.
     * @throws {Error} If the login fails.
     */
    async login(username: string, password: string) {
      try {
        log.debug('About to call api.post with username and password:', username, password);
        const response = await api.post('/api/token/', { username, password });
        log.debug('Response from api.post:', response);
        this.accessToken = response.data.access;
        log.debug('this.accessToken:', this.accessToken);
        this.refreshToken = response.data.refresh;
        log.debug('this.refreshToken:', this.refreshToken);
        localStorage.setItem('access_token', this.accessToken as string);
        localStorage.setItem('refresh_token', this.refreshToken as string);
        // Optionally, fetch and set user data here
        await this.profile();
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
    async register(username: string, password: string, first_name: string, last_name: string, email: string) {
      try {
        log.debug('About to call api.post with username, password, firstname, lastname, and email:', { username, password, first_name, last_name, email });
        await api.post('/api/register/', { username, password, first_name, last_name, email });
        log.debug('Registration successful');
      } catch (error) {
        throw new Error('Registration failed', error as Error)
      } 
    },
    async updateProfile(first_name: string, last_name: string, email: string) {
      try {
        log.debug('About to call api.put with firstname, lastname, and email:', { first_name, last_name, email });
        const response = await api.put('/api/profile/update/', { first_name, last_name, email });
        log.debug('Update successful:', response);
        this.first_name = response.data.first_name;
        localStorage.setItem('first_name', this.first_name as string);
        this.last_name = response.data.last_name;
        localStorage.setItem('last_name', this.last_name as string);
        this.email = response.data.email;
        localStorage.setItem('email', this.email as string);
      } catch (error) {
        throw new Error('Update failed', error as Error)
      } 
    },
    async profile() {
      try {
        log.debug('About to call api.get to get profile.');
        const response = await api.get('/api/profile/');
        log.debug('Response from api.get:', response);
        this.username = response.data.username;
        localStorage.setItem('username', this.username as string);
        this.first_name = response.data.first_name;
        localStorage.setItem('first_name', this.first_name as string);
        this.last_name = response.data.last_name;
        localStorage.setItem('last_name', this.last_name as string);
        this.email = response.data.email;
        localStorage.setItem('email', this.email as string);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch user profile', error as Error);
      }
    },
    async changePassword(old_password: string, new_password: string) {
      try {
        log.debug('About to call api.post with old_password and new_password:', { old_password, new_password });
        await api.post('/api/password/change/', { old_password, new_password });
        log.debug('Password change successful');
      } catch (error) {
        throw new Error('Password change failed', error as Error)
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
});