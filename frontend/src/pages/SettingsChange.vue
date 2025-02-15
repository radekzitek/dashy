<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
      <q-img src="images/settings.jpg">
        <div class="text-h5 absolute-bottom text-right">Settings</div>
      </q-img>
      <q-card-section>
        <q-input filled v-model="currentPassword" label="Current Password" type="password" class="q-ma-xs" />
        <div class="row q-col-gutter-none">
          <div class="col-6">
            <q-input filled v-model="password" label="Password" type="password" class="q-ma-xs" />
          </div>
          <div class="col-6">
            <q-input filled v-model="passwordVerify" label="Verify Password" type="password" class="q-ma-xs" />
          </div>
        </div>
        <q-btn color="primary" label="Change Password" class="q-ma-sm" @click="handleChangePassword"
          :disabled="!passwordsMatch || !allFieldsValid" />
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

const currentPassword = ref('')
const password = ref('')
const passwordVerify = ref('')

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const passwordsMatch = computed(() => password.value === passwordVerify.value)

const isPasswordValid = computed(() => password.value !== '')
const isPasswordVerifyValid = computed(() => passwordVerify.value !== '')

const allFieldsValid = computed(() => {
  return (
    isPasswordValid.value &&
    isPasswordVerifyValid.value
  )
})

function handleChangePassword() {
  try {
    log.debug('Going to handle change password:', currentPassword.value, password.value)
    authStore.changePassword(currentPassword.value, password.value)
    uiStore.setFooterText("Successfully changed.");
    void router.push('/')
  } catch (error: unknown) {
    console.error(error)
    let errorMessage = 'Chnage failed. Please try again.'; // Default message

    if (error instanceof Error) {
      errorMessage = `Change failed: ${error.message}. Please try again.`;
    } else {
      errorMessage = `Change failed: An unexpected error occurred. Please try again.`;
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