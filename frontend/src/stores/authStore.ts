import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthAPI } from '../composables/useAuthAPI';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const username = ref<string | null>(null);
  const fullname = ref<string | null>(null);

  function doLogin(user: string, pass: string) {
    const { loginAPICall } = useAuthAPI();
    const response = loginAPICall(user, pass);
    if (!response.success) {
      throw new Error('Invalid credentials');
    }
    isAuthenticated.value = true;
    username.value = response.user.username;
    fullname.value = response.user.fullname;
  }

  function doLogout() {
    isAuthenticated.value = false;
    username.value = null;
    fullname.value = null;
  }

  function doRegister(user: string, pass: string, full: string, email: string) {
    const { registerAPICall } = useAuthAPI();
    registerAPICall(user, pass, full, email);
  }

  return { isAuthenticated, username, fullname, doLogin, doLogout, doRegister };
});