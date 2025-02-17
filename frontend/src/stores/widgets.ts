import { defineStore } from 'pinia'

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    widgets: [] as string[],
  }),
  actions: {
    addWidget(widget: string) {
      this.widgets.push(widget)
    },
    removeWidget(widget: string) {
      const index = this.widgets.indexOf(widget)
      if (index !== -1) {
        this.widgets.splice(index, 1)
      }
    }
  },
})