<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
      <q-img src="images/login.jpg">
        <div class="text-h5 absolute-bottom text-right">Login</div>
      </q-img>
      <q-card-section>
        <div class="row q-col-gutter-none">
          <div class="col-6">
            <q-input filled v-model="username" label="Username" class="q-ma-xs" />
          </div>
          <div class="col-6">
            <q-input filled v-model="email" label="e-Mail" class="q-ma-xs" />
          </div>
        </div>
        <div class="row q-col-gutter-none">
          <div class="col-6">
            <q-input filled v-model="firstname" label="First Name" class="q-ma-xs" />
          </div>
          <div class="col-6">
            <q-input filled v-model="lastname" label="Last Name" class="q-ma-xs" />
          </div>
        </div>
        <div class="row q-col-gutter-none">
          <div class="col-6">
            <q-input filled v-model="password" label="Password" type="password" class="q-ma-xs" />
          </div>
          <div class="col-6">
            <q-input filled v-model="passwordVerify" label="Verify Password" type="password" class="q-ma-xs" />
          </div>
        </div>
        <q-btn color="primary" label="Register" class="q-ma-sm" @click="handleRegister" :disabled="!passwordsMatch || !allFieldsValid" />
        <q-btn color="primary" label="Cancel" class="q-ma-sm" @click="$router.push('/')" />
        <div v-if="!passwordsMatch" class="text-negative q-mt-sm">Passwords do not match</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import log from '../services/logger'

const username = ref('')
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const passwordVerify = ref('')

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const passwordsMatch = computed(() => password.value === passwordVerify.value)

const isUsernameValid = computed(() => username.value !== '')
const isFirstnameValid = computed(() => firstname.value !== '')
const isLastnameValid = computed(() => lastname.value !== '')
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})
const isPasswordValid = computed(() => password.value !== '')
const isPasswordVerifyValid = computed(() => passwordVerify.value !== '')

const allFieldsValid = computed(() => {
  return (
    isUsernameValid.value &&
    isFirstnameValid.value &&
    isLastnameValid.value &&
    isEmailValid.value &&
    isPasswordValid.value &&
    isPasswordVerifyValid.value
  )
})

function handleRegister() {
  try {
    log.debug('Going to handle register:', username.value, password.value, firstname.value, lastname.value, email.value)
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
  max-width: 450px
</style>
