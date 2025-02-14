<template>
  <q-page class="q-pa-lg">
    <q-card bordered flat class="my-card q-mx-auto">
      <q-img src="images/login.jpg">
        <div class="text-h5 absolute-bottom text-right">Login</div>
      </q-img>
      <q-card-section>
        <q-input filled v-model="username" label="Username" class="q-ma-sm" />
        <q-input filled v-model="firstname" label="First Name" class="q-ma-sm" />
        <q-input filled v-model="lastname" label="Last Name" class="q-ma-sm" />
        <q-input filled v-model="email" label="e-Mail" class="q-ma-sm" />
        <q-input filled v-model="password" label="Password" type="password" class="q-ma-sm" />
        <q-input filled v-model="passwordVerify" label="Verify Password" type="password" class="q-ma-sm" />
        <q-btn color="primary" label="Register" class="q-ma-sm" @click="handleRegister" />
        <q-btn color="primary" label="Cancel" class="q-ma-sm" @click="$router.push('/')" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/uiStore'

const username = ref('')
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const passwordVerify = ref('')

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

function handleRegister() {
  try {
    console.log('Going to handle register:', username.value, password.value, firstname.value, lastname.value, email.value)
    authStore.register(username.value, password.value, firstname.value, lastname.value, email.value)
    uiStore.setFooterText("Successfully registered.");
    void router.push('/')
  } catch (error: unknown) {
    console.error(error)
    let errorMessage = 'Registration failed. Please try again.'; // Default message

    if (error instanceof Error) {
      errorMessage = `Registration failed: ${error.message}. Please try again.`;
    } else {
      errorMessage = `Registration failed: An unexpected error occurred. Please try again.`;
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
