<template>
    <q-page class="dashboard">
        <div class="q-gutter-md row q-ma-sm">
            <component v-for="widget in widgets" :key="widget.id" :is="widgetRegistry[widget.type]"
                v-bind="widget.config" class="col-12 col-md-3 col-lg-2" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import type { defineComponent } from 'vue'
import { ref } from 'vue'
import WeatherWidget from 'src/components/WeatherWidget.vue'
import NewsWidget from 'src/components/NewsWidget.vue'
import CalendarWidget from 'src/components/CalendarWidget.vue'

// Define a type for the widget types
type WidgetType = 'weather' | 'news' | 'calendar'

// Define a simple widget registry mapping widget types to components
const widgetRegistry: Record<WidgetType, ReturnType<typeof defineComponent>> = {
    weather: WeatherWidget,
    news: NewsWidget,
    calendar: CalendarWidget,
}

// Define the widget configuration type
interface WidgetConfig {
    id: number
    type: WidgetType
    config: Record<string, unknown>
}

// Example widget configuration; in a real app, this comes from state/backend
const widgets = ref<WidgetConfig[]>([
    { id: 1, type: 'weather', config: { location: 'New York' } },
    { id: 2, type: 'news', config: { category: 'technology' } },
    { id: 3, type: 'calendar', config: {} },
])
</script>
