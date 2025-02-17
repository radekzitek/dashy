<template>
  <q-card elevated class="my-card">
    <!-- Header section with the title of the widget -->
    <q-card-section class="q-pa-sm bg-primary text-white">
      <div class="header-content">
        <div class="text-h6">Calendar</div>
        <q-btn icon="settings" class="q-ml-sm" />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="">Upcoming Events</div>
      <div v-if="events.length">
        <ul>
          <li v-for="event in events" :key="event.id">{{ event.name }} - {{ event.date }}</li>
        </ul>
      </div>
      <div v-else>
        <p>No upcoming events.</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const events = ref<{ id: number, name: string, date: string }[]>([])

console.log('Calendar widget initialized')

async function fetchEvents() {
  // Replace with real API call
  events.value = [
    { id: 1, name: 'Event 1', date: '2025-02-20' },
    { id: 2, name: 'Event 2', date: '2025-02-25' },
  ]
}

onMounted(fetchEvents)
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
