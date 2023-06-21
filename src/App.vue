<template>
  <div class="bg-base-100 flex flex-row">
    <create-modal />
    <view-post-modal />
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
import CreateModal from './components/modal/create-modal.vue'
import ViewPostModal from './components/modal/view-post-modal.vue'

import { useNoficationStore } from './store/noficationStrore'
import { useAuthStore } from './store/useAuthStore'
const noficationStrore = useNoficationStore()
const authStore = useAuthStore()

watch(
  () => authStore.userInfo.uid,
  () => {
    noficationStrore.listeningNofication(authStore.userInfo.uid)
  }
)
</script>
<style></style>
