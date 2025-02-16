// filepath: /workspaces/insitu/qlab/qlab-project/src/stores/uiStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const footerText = ref('Ready.');

  function setFooterText(text: string) {
    if (footerText.value.length > 120) {
      footerText.value = '...' + (footerText.value.slice(-120) + ' | ' + text)
    } else {
      footerText.value = (footerText.value + ' | ' + text)
    }
  }

  return { footerText, setFooterText };
});