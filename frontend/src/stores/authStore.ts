import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthAPI } from '../composables/useAuthAPI';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const username = ref<string | null>(null);
  const fullname = ref<string | null>(null);
  const access = ref<string | null>(null);
  const refresh = ref<string | null>(null);

  async function doLogin(user: string, pass: string) {
    try {
      const { loginAPICall } = useAuthAPI();
      console.log('Logging in:', user, pass);
      const response = await loginAPICall(user, pass);
      console.log('Login successful:', response);
      username.value = user;
      fullname.value = user; // this needs to be fixed later
      access.value = response.access;
      refresh.value = response.refresh;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  function doLogout() {
    isAuthenticated.value = false;
    username.value = null;
    fullname.value = null;
    access.value = null;
    refresh.value = null;
  }

  function doRegister(user: string, pass: string, full: string, email: string) {
    const { registerAPICall } = useAuthAPI();
    registerAPICall(user, pass, full, email);
  }

  return { isAuthenticated, username, fullname, access, refresh, doLogin, doLogout, doRegister };
});