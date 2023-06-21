<template>
  <div
    class="h-full w-full fixed inset-0 backdrop-brightness-50 flex justify-center items-center"
    v-show="modalStore.likeModalOpen"
  >
    <div class="h-96 w-96 bg-base-100 rounded-lg overflow-y-auto relative">
      <span
        class="font-semibold absolute right-4 top-2 cursor-pointer"
        @click="
          () => {
            modalStore.likeModalOpen = false
            modalStore.likeArr = undefined
            data = []
          }
        "
        >X</span
      >
      <span class="text-center block p-2">Likes</span>
      <div class="border-b border-zinc-300"></div>
      <div>
        <div v-for="user in data" :key="user.uid" class="flex ga-4 p-4">
          <img :src="user.photoURL" alt="" class="h-8 w-8 rounded-full" />
          <span class="ml-2 font-semibold">{{ user.displayName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { db } from '@/firebase/config'
import type { UserInfo } from '@/store/useAuthStore'
import { useModalStore } from '@/store/useModalStore'
import { query, where, collection, getDocs } from 'firebase/firestore'
import { ref, watch } from 'vue'
const modalStore = useModalStore()
const data = ref<Partial<UserInfo>[]>([])
const getData = async (value: string[]) => {
  if (value.length > 0) {
    const q = query(collection(db, 'users'), where('uid', 'in', value))
    try {
      const respone = await getDocs(q)
      data.value = respone.docs.map((doc) => ({
        uid: doc.data().uid,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL
      }))
    } catch (err) {
      data.value = []
      throw err
    }
  }
}
watch(
  () => modalStore.likeArr,
  (newVal) => {
    if (newVal) {
      getData(newVal as string[])
    }
  }
)
</script>
