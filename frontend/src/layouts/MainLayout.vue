<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar class="glossy">
        <q-btn icon="menu_open" @click="toggleLeftDrawer" />
        <q-space />
        <q-btn icon="more_vert">
          <q-menu>
            <q-list>
              <q-item clickable v-ripple @click="toggleTheme">
                <q-item-section avatar>
                  <q-icon name="brightness_6" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>THEME</q-item-label>
                  <q-item-label>Switch color theme</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="isAuthenticated" clickable v-ripple  @click="$router.push('/profile/update')">
                <q-item-section avatar>
                  <q-icon name="face" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>PROFILE</q-item-label>
                  <q-item-label>Change your profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="isAuthenticated" clickable v-ripple @click="$router.push('/settings/change')">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>SETTINGS</q-item-label>
                  <q-item-label>Set your preferences</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!isAuthenticated" clickable v-ripple @click="$router.push('/login')">
                <q-item-section avatar>
                  <q-icon name="login" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>LOGIN</q-item-label>
                  <q-item-label>Log yourself in</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="isAuthenticated" clickable v-ripple @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>LOGOUT</q-item-label>
                  <q-item-label>Log ourself out</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!isAuthenticated" clickable v-ripple @click="$router.push('/register')">
                <q-item-section avatar>
                  <q-icon name="done" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>REGISTER</q-item-label>
                  <q-item-label>Register your account</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer bordered v-model="leftDrawerOpen" show-if-above class="bg-primary text-white">
      <q-list>
        <q-toolbar class="glossy">
          <q-toolbar-title class="text-weight-bold text-center text-uppercase">D - A - S - H - Y</q-toolbar-title>
        </q-toolbar>
        <q-item clickable v-ripple @click="$router.push('/')">
          <q-item-section avatar>
            <q-icon color="white" name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-white" overline>HOME</q-item-label>
            <q-item-label class="text-white">Return to home page</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push('/about')">
          <q-item-section avatar>
            <q-icon color="white" name="book" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-white" overline>ABOUT</q-item-label>
            <q-item-label class="text-white">See more information</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-footer bordered class="bg-primary text-white q-pa-xs" position="fixed">
      <div class="text-center">
        {{ uiStore.footerText }}
      </div>
    </q-footer>
    <q-page-container>
      <router-view />
      <q-toolbar class="glossy">
        <q-space />
        <q-btn icon="arrow_upward" />
      </q-toolbar>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useUiStore } from '../stores/ui'
// import { useAuthStore } from '../stores/authStore'
import { useAuthStore } from '../stores/auth'


const uiStore = useUiStore()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Function to toggle theme (light/dark)
const $q = useQuasar()

function toggleTheme() {
  $q.dark.toggle()
  uiStore.setFooterText('Theme changed to ' + ($q.dark.isActive ? 'dark' : 'light') + '.')
}

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  authStore.logout()
}
</script>
