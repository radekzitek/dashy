<template>
  <q-card elevated class="my-card">
    <!-- Header section with the title of the widget -->
    <q-card-section class="q-pa-sm bg-primary text-white">
      <div class="header-content">
        <div class="text-h6">Weather</div>
        <q-btn icon="settings" class="q-ml-sm" />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="">Weather for {{ location }}</div>
      <div v-if="weather">
        <p>Temperature: {{ weather.temp }}°C</p>
        <p>Condition: {{ weather.condition }}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{ location: string }>()
const weather = ref<{ temp: number, condition: string } | null>(null)

console.log('Weather widget initialized for location:', props.location)

async function fetchWeather() {
  // Replace with real API call
  weather.value = { temp: 22, condition: 'Sunny' }
}

onMounted(fetchWeather)
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px

.bg-primary
  background-color: #027be3 // Adjust the color as needed

.text-white
  color: white

.header-content
  display: flex
  align-items: center
  justify-content: space-between

.q-ml-sm
  margin-left: 8px // Adjust the margin as needed
</style>