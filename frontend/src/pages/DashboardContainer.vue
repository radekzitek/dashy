<template>
    <q-page class="dashboard">
        <div class="q-gutter-md row q-ma-sm">
            <component v-for="widget in widgetDisplay.widgets" :key="widget.id"
                :is="widgetRegistry[widget.type]" v-bind="widget.config" class="col-12 col-md-3 col-lg-2">

            </component>
        </div>
        <q-btn icon="add_circle" class="floating-btn" @click="addWidget" color="primary" round fab />
    </q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue';

function generateUID() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-yyyy'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

interface Widget {
    id: string;
    type: string;
    config: Record<string, any>;
}

const widgetDisplay = {
    widgets: ref<Widget[]>([
        { id: generateUID(), type: 'weather', config: { /* widget specific config */ } },
        { id: generateUID(), type: 'news', config: { /* widget specific config */ } },
        // Add more widgets as needed
    ])
};

import { onMounted } from 'vue';

const widgetRegistry: Record<string, () => Promise<typeof import('*.vue')>> = {
    widgetDisplay.widgets.value.forEach(widget => {
        console.log(`Widget ID: ${widget.id}, Type: ${widget.type}`);
    });
});

const widgetRegistry = {
    'weather': () => import('@/components/widgets/WeatherWidget.vue'),
    'news': () => import('@/components/widgets/NewsWidget.vue'),
    'calendar': () => import('@/components/widgets/CalendarWidget.vue'),
    // Add more widget types as needed
};

function addWidget() {
    widgetDisplay.widgets.value.push({
        id: Date.now(),
        type: 'WidgetTypeA', // Default type, change as needed
        config: { /* default config */ }
    });
}

</script>

<style scoped>
.dashboard {
    position: relative;
}

.floating-btn {
    position: fixed;
    bottom: 16px;
    right: 16px;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.q-ml-sm {
    margin-left: 8px;
}
</style>
