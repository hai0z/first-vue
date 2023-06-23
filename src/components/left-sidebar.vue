<template>
  <div
    :class="[
      'border-r-[0.5px] border-base-300 bg-base-100 h-screen fixed px-4 py-8 transition-all duration-500 md:flex flex-col items-center hidden',
      !noficationShow ? 'lg:w-[18%] w-24' : 'w-24'
    ]"
  >
    <div class="h-10 flex flex-col w-full justify-center items-center">
      <RouterLink
        to="/"
        v-if="!noficationShow"
        class="p-4 font-mono w-full flex items-center gap-4"
      >
        <span class="text-3xl">Instagram</span>
        <div @click="changeTheme">
          <i v-if="currentTheme == 'night'" class="fa-solid fa-sun text-xl text-primary"></i>
          <i v-if="currentTheme == 'cmyk'" class="fa-solid fa-moon text-xl text-primary"></i>
        </div>
      </RouterLink>
      <RouterLink to="/" v-else class="fa-brands fa-instagram text-2xl"></RouterLink>
    </div>

    <div class="mt-8 space-y-3 w-full">
      <RouterLink
        to="/"
        class="flex gap-3 hover:bg-primary hover:text-primary-content rounded-md p-4 items-center overflow-hidden"
      >
        <i class="fa-solid fa-house text-2xl"></i>
        <span v-show="!noficationShow" class="font-bold hidden lg:block">Home</span>
      </RouterLink>
      <div
        class="flex gap-3 hover:bg-primary hover:text-primary-content p-4 rounded-md cursor-pointer"
        @click="() => modalStore.setOpenCreateModal(true)"
      >
        <i class="fa-regular fa-square-plus text-2xl"></i>
        <button v-show="!noficationShow" class="hidden lg:block">Create</button>
      </div>
      <div
        @click="hanldeNoficationOpen"
        class="flex gap-3 hover:bg-primary hover:text-primary-content p-4 rounded-md cursor-pointer relative group"
      >
        <i class="fa-regular fa-heart text-2xl"></i>
        <button v-show="!noficationShow" class="hidden lg:block">Nofication</button>
        <span
          v-show="authStore.userInfo.noficationCount     as number > 0"
          class="badge badge-primary absolute right-0 group-hover:badge-secondary"
          >{{ authStore.userInfo.noficationCount }}</span
        >
      </div>

      <RouterLink
        class="flex gap-3 hover:bg-primary hover:text-primary-content p-4 rounded-md"
        to="/profile"
      >
        <img :src="authStore.userInfo.photoURL" class="h-7 w-7 rounded-full" />
        <span v-show="!noficationShow" class="line-clamp-1">{{
          authStore.userInfo.displayName
        }}</span>
      </RouterLink>
      <div class="flex gap-3 rounded-md">
        <button @click="auth.signOut" class="btn btn-link btn-xs">Logout</button>
      </div>
    </div>
  </div>
  <Presence>
    <Motion
      :class="[
        'h-screen overflow-y-auto fixed left-24 transition-all duration-150 opacity-0 z-1 bg-base-100',
        noficationShow
          ? 'w-96 opacity-100 border-r border-base-300'
          : 'w-0 opacity-0 duration-0 border-0 border-none'
      ]"
    >
      <span class="p-4 font-bold text-2xl hidden lg:block">Nofication</span>
      <span v-if="noficationStore.listNofications.length == 0" class="p-4">Chưa có thông báo!</span>
      <div class="p-4 flex flex-col gap-8 line-clamp-1">
        <RouterLink
          :to="`${
            nofication.type == 'COMMENT' || nofication.type == 'LIKE'
              ? `/nofication/p/${nofication.post?.postId}`
              : ''
          }`"
          v-for="(nofication, index) in noficationStore.listNofications"
          :key="index"
          class="flex gap-4"
        >
          <img :src="nofication.from.photoURL" alt="" class="h-8 w-8 rounded-full object-cover" />
          <div class="flex items-center w-full">
            <div class="w-[80%]">
              <span>{{ nofication.message }}</span>
              <p class="text-xs text-zinc-400">
                {{ formatDistance(nofication.createdAt, Date.now(), { addSuffix: true }) }}
              </p>
            </div>
            <div v-if="nofication.type == 'COMMENT' || nofication.type == 'LIKE'" class="ml-auto">
              <img :src="nofication.post?.imageUrl?.[0]" alt="" class="h-10 w-10 object-cover" />
            </div>
          </div>
        </RouterLink>
      </div>
    </Motion>
  </Presence>
</template>
<script lang="ts" setup>
import { auth } from '@/firebase/config'
import { useAuthStore } from '@/store/useAuthStore'
import { useModalStore } from '@/store/useModalStore'
import { onMounted, ref } from 'vue'
import { Motion, Presence } from 'motion/vue'
import { useNoficationStore } from '@/store/noficationStrore'
import { formatDistance } from 'date-fns'
const modalStore = useModalStore()
const authStore = useAuthStore()
const noficationShow = ref(false)
const noficationStore = useNoficationStore()
const currentTheme = ref<any>(localStorage.getItem('theme') ?? 'cmyk')

const changeTheme = () => {
  if (currentTheme.value == 'cmyk') {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', 'night')
    localStorage.setItem('theme', 'night')
    currentTheme.value = 'night'
  } else {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', 'cmyk')
    localStorage.setItem('theme', 'cmyk')
    currentTheme.value = 'cmyk'
  }
}
const hanldeNoficationOpen = () => {
  const isOpen = noficationShow.value
  if (!isOpen) {
    authStore.updateNoficationCount()
    noficationShow.value = true
  } else {
    noficationShow.value = false
  }
}
onMounted(() => {
  noficationStore.getNofications()
})
</script>
