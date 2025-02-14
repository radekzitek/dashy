<template>
    <q-page class="q-pa-sm">
        Hello!!! {{ fullname }}!
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
//const isAuthenticated = computed(() => authStore.isAuthenticated)

const fullname = computed(() => authStore.fullname)

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
