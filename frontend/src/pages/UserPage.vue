<template>
    <q-page class="q-pa-sm">
        <div>
            <h4>User Profile</h4>
            <p><strong>Userame:</strong> {{ authStore.username }}</p>
            <p><strong>First Name:</strong> {{ authStore.first_name }}</p>     
            <p><strong>Last Name:</strong> {{ authStore.last_name }}</p>       
            <p><strong>Email:</strong> {{ authStore.email }}</p>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
