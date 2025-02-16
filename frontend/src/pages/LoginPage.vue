<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
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
import { useQuasar } from 'quasar'
import log from '../services/logger'
import { isAxiosError } from 'axios'

const username = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const $q = useQuasar()

async function handleLogin() {
  try {
    log.debug('Going to handle login:', username.value, password.value)
    await authStore.login(username.value, password.value)
    log.debug('After login isAuthenticated:', authStore.isAuthenticated)
    if (authStore.isAuthenticated) {
      uiStore.setFooterText("Successfully logged in.");
      void router.push('/')
    }
  } catch (error: unknown) {
    console.debug("have error", error)
    let errorMessage = '';

    if (isAxiosError(error)) {
      console.debug("is axios error")
      if (error.response && error.response.status === 401) {
        console.debug("is 401")
        errorMessage = 'Incorrect username or password. Please try again.';
      } else if (error instanceof Error) {
        console.debug("is error")
        errorMessage = `${error.message}.`;
      } 
    }
    else {
      console.debug("is not axios error")
      errorMessage = `Login failed: An unexpected error occurred.`;
    }

    uiStore.setFooterText(errorMessage);

    $q.dialog({
      title: 'Login Failed',
      message: errorMessage,
      ok: {
        label: 'OK',
        color: 'primary'
      }
    })
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
