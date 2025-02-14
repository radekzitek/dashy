// filepath: /workspaces/insitu/qlab/qlab-project/src/stores/uiStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const footerText = ref('Ready.');

  function setFooterText(text: string) {
    footerText.value = text;
  }

  return { footerText, setFooterText };
});