import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useModalStore = defineStore('modals', () => {
  const createModalOpen = ref<boolean>(false)
  const setOpenCreateModal = (visible: boolean) => (createModalOpen.value = visible)
  return {
    createModalOpen,
    setOpenCreateModal
  }
})
