<template>
  <q-page class="q-pa-lg">
    <q-card bordered flat class="my-card q-mx-auto">
      <q-img src="images/login.jpg">
        <div class="text-h5 absolute-bottom text-right">Login</div>
      </q-img>
      <q-card-section>
        <q-input filled v-model="username" label="Username" class="q-ma-sm" />
        <q-input filled v-model="password" label="Password" type="password" class="q-ma-sm" />
        <q-btn color="primary" label="Login" class="q-ma-sm" @click="handleLogin" />
        <q-btn color="primary" label="Cancel" class="q-ma-sm" @click="$router.push('/')" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const username = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

async function handleLogin() {
  try {
    console.log('Goin to handle login:', username.value, password.value)
    await authStore.login(username.value, password.value)
    console.log('After login isAuthenticated:', authStore.isAuthenticated)
    if (authStore.isAuthenticated) {
      uiStore.setFooterText("Successfully logged in.");
      void router.push('/')
    }
  } catch (error: unknown) {
    console.error(error)
    let errorMessage = 'Login failed. Please try again.'; // Default message

    if (error instanceof Error) {
      errorMessage = `Login failed: ${error.message}. Please try again.`;
    } else {
      errorMessage = `Login failed: An unexpected error occurred. Please try again.`;
    }

    uiStore.setFooterText(errorMessage);
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
