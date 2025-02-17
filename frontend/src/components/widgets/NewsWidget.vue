<template>
  <q-card elevated class="my-card">
    <!-- Header section with the title of the widget -->
    <q-card-section class="q-pa-sm bg-primary text-white">
      <div class="header-content">
        <div class="text-h6">News</div>
        <q-btn icon="settings" class="q-ml-sm" />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="">News for {{ category }}</div>
      <div v-if="news">
        <p>Headline: {{ news.headline }}</p>
        <p>Summary: {{ news.summary }}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{ category: string }>()
const news = ref<{ headline: string, summary: string } | null>(null)

console.log('News widget initialized for category:', props.category)

async function fetchNews() {
  // Replace with real API call
  news.value = { headline: 'Breaking News', summary: 'This is a summary of the breaking news.' }
}

onMounted(fetchNews)
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
