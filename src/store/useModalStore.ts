import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modals', () => {
  const createModalOpen = ref<boolean>(false)
  const viewPostModalOpen = ref<boolean>(false)
  const setOpenCreateModal = (visible: boolean) => (createModalOpen.value = visible)
  const setOpenViewPostModal = (visible: boolean) => (viewPostModalOpen.value = visible)
  return {
    createModalOpen,
    setOpenCreateModal,
    viewPostModalOpen,
    setOpenViewPostModal
  }
})
