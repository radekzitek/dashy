<template>
  <q-page class="q-pa-lg">
    <q-card v-if="!isAuthenticated" bordered flat class="my-card q-mx-auto">
      <q-img src="images/lab.jpg">
        <div class="text-h5 absolute-bottom text-right">Home</div>
      </q-img>
      <q-card-section>
        This is Quasar Laboratory application only. Use the tripple dot menu on the right side, navigate through the
        drawer menu on the left and toggle the drawer with the button on the top of the page.
      </q-card-section>
    </q-card>
    <UserPage v-if="isAuthenticated" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import UserPage from './UserPage.vue';

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

//const fullname = computed(() => authStore.fullname)

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
