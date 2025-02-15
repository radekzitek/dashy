<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
      <q-img src="images/login.jpg">
        <div class="text-h5 absolute-bottom text-right">Update Profile</div>
      </q-img>
      <q-card-section>
        <div class="row q-col-gutter-none">
          <div class="col-6">
            <q-input filled v-model="username" label="Username" class="q-ma-xs" :disable="true"/>
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
        <q-btn color="primary" label="Update" class="q-ma-sm" @click="handleUpdateProfile" :disabled="!allFieldsValid" />
        <q-btn color="primary" label="Cancel" class="q-ma-sm" @click="$router.push('/')" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const username = ref(authStore.username)
const firstname = ref(authStore.first_name)
const lastname = ref(authStore.last_name)
const email = ref(authStore.email)

const isFirstnameValid = computed(() => firstname.value !== '')
const isLastnameValid = computed(() => lastname.value !== '')
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value as string)
})

const allFieldsValid = computed(() => {
  return (
    isFirstnameValid.value &&
    isLastnameValid.value &&
    isEmailValid.value 
  )
})

function handleUpdateProfile() {
  try {
    console.log('Going to handle update profile:', firstname.value, lastname.value, email.value)
    authStore.updateProfile( firstname.value as string, lastname.value as string, email.value as string)
    uiStore.setFooterText("Successfully updated profile.");
    void router.push('/')
  } catch (error: unknown) {
    console.error(error)
    let errorMessage = 'Update failed. Please try again.'; // Default message

    if (error instanceof Error) {
      errorMessage = `Update failed: ${error.message}. Please try again.`;
    } else {
      errorMessage = `Update failed: An unexpected error occurred. Please try again.`;
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
