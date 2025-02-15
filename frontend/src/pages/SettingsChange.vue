<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
      <q-img src="images/settings.jpg" class="image-cropped">
        <div class="text-h5 absolute-bottom text-right">Settings</div>
      </q-img>
      <q-card-section>
        <!-- Input for current password -->
        <q-input filled v-model="oldPassword" label="Current Password" type="password" class="q-ma-xs" />
        <div class="row q-col-gutter-none">
          <!-- Input for new password -->
          <div class="col-6">
            <q-input filled v-model="password" label="Password" type="password" class="q-ma-xs" />
            <!-- Password strength feedback -->
            <div v-if="password.length > 0" class="q-ma-xs">
              <div :class="{'text-positive': hasLength, 'text-negative': !hasLength, 'hint-text': true}">
                Password must be at least 8 characters long
              </div>
              <div :class="{'text-positive': hasNumber, 'text-negative': !hasNumber, 'hint-text': true}">
                Password must include a number
              </div>
              <div :class="{'text-positive': hasSpecialChar, 'text-negative': !hasSpecialChar, 'hint-text': true}">
                Password must include a special character
              </div>
              <div :class="{'text-positive': hasUpperCase, 'text-negative': !hasUpperCase, 'hint-text': true}">
                Password must include an uppercase letter
              </div>
            </div>
          </div>
          <!-- Input for verifying new password -->
          <div class="col-6">
            <q-input filled v-model="passwordVerify" label="Verify Password" type="password" class="q-ma-xs" />
          </div>
        </div>
        <!-- Button to change password, disabled if passwords do not match or fields are invalid -->
        <q-btn color="primary" label="Change Password" class="q-ma-sm" @click="handleChangePassword"
          :disabled="!passwordsMatch || !isPasswordStrong || isLoading" />
        <!-- Button to cancel and navigate back -->
        <q-btn color="primary" label="Cancel" class="q-ma-sm" @click="handleCancel" :disabled="isLoading" />
        <!-- Loading indicator -->
        <q-spinner v-if="isLoading" color="primary" size="30px" class="q-my-md" />
        <!-- Error message if passwords do not match -->
        <div v-if="!passwordsMatch" class="text-negative q-mt-sm">Passwords do not match</div>
        <!-- Error message if password is not strong enough -->
        <div v-if="!isPasswordStrong" class="text-negative q-mt-sm">Password must be at least 8 characters long and include a number, a special character, and an uppercase letter.</div>
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

// Reactive references for form fields
const oldPassword = ref('')
const password = ref('')
const passwordVerify = ref('')

// Reactive reference for loading state
const isLoading = ref(false)

// Initialize router and stores
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

// Computed property to check if passwords match
const passwordsMatch = computed(() => password.value === passwordVerify.value)

// Computed properties for password strength criteria
const hasLength = computed(() => password.value.length >= 8)
const hasNumber = computed(() => /\d/.test(password.value))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value))
const hasUpperCase = computed(() => /[A-Z]/.test(password.value))

// Computed property to check if password is strong
const isPasswordStrong = computed(() => {
  return hasLength.value && hasNumber.value && hasSpecialChar.value && hasUpperCase.value
})

// Function to clear form fields
function clearForm() {
  oldPassword.value = ''
  password.value = ''
  passwordVerify.value = ''
}

// Function to handle password change
/**
 * Handles the password change process.
 * - Sets the loading state to true.
 * - Calls the `changePassword` method of the `authStore` with the old and new passwords.
 * - Sets the footer text to "Successfully changed." if the password change is successful.
 * - Clears the form fields.
 * - Navigates to the home page.
 * - Handles any errors that occur during the password change process and sets the footer text with an appropriate error message.
 * - Sets the loading state to false in the finally block.
 */
async function handleChangePassword() {
  try {
    isLoading.value = true
    log.debug('Going to handle change password:', oldPassword.value, password.value)
    await authStore.changePassword(oldPassword.value, password.value)
    uiStore.setFooterText("Successfully changed.")
    clearForm()
    void router.push('/')
  } catch (error: unknown) {
    console.error(error)
    let errorMessage = 'Change failed. Please try again.' // Default message

    if (error instanceof Error) {
      errorMessage = `Change failed: ${error.message}. Please try again.`
    } else {
      errorMessage = `Change failed: An unexpected error occurred. Please try again.`
    }
    uiStore.setFooterText(errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Function to handle cancel action
function handleCancel() {
  clearForm()
  router.push('/')
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 450px

.image-cropped
  height: 150px
  object-fit: cover

.hint-text
  font-size: 0.65rem // Adjust the font size as needed
</style>