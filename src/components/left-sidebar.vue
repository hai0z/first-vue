<template>
  <div
    :class="[
      'border-r-[0.5px] h-screen fixed px-4 py-8 transition-all duration-500 flex flex-col items-center',
      !noficationShow ? 'w-[18%]' : 'w-24'
    ]"
  >
    <div class="h-10 flex flex-col w-full justify-center items-center">
      <img
        v-if="!noficationShow"
        class="object-cover w-28 ml-4 self-start"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
        alt=""
      />
      <svg
        v-else
        aria-label="Instagram"
        class="x1lliihq x1n2onr6"
        color="rgb(0, 0, 0)"
        fill="rgb(0, 0, 0)"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <title>Instagram</title>
        <path
          d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"
        ></path>
      </svg>
    </div>
    <div class="mt-8 space-y-3 w-full">
      <RouterLink
        to="/"
        class="flex gap-3 hover:bg-primary rounded-md p-4 items-center overflow-hidden"
      >
        <svg
          aria-label="Home"
          class="_ab6-"
          color="rgb(0, 0, 0)"
          fill="rgb(0, 0, 0)"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <path
            d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
        <span v-show="!noficationShow" class="font-bold">Home</span>
      </RouterLink>
      <div
        class="flex gap-3 hover:bg-primary p-4 rounded-md cursor-pointer"
        @click="() => modalStore.setOpenCreateModal(true)"
      >
        <svg
          aria-label="New post"
          class="_ab6-"
          color="rgb(0, 0, 0)"
          fill="rgb(0, 0, 0)"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <path
            d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
          <line
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            x1="6.545"
            x2="17.455"
            y1="12.001"
            y2="12.001"
          ></line>
          <line
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            x1="12.003"
            x2="12.003"
            y1="6.545"
            y2="17.455"
          ></line>
        </svg>
        <button v-show="!noficationShow">Create</button>
      </div>
      <div
        @click="noficationShow = !noficationShow"
        class="flex gap-3 hover:bg-primary p-4 rounded-md cursor-pointer"
      >
        <svg
          aria-label="Notifications"
          class="x1lliihq x1n2onr6"
          color="var(--p)"
          fill="var(--p)"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <title>Notifications</title>
          <path
            d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
          ></path>
        </svg>
        <button v-show="!noficationShow">Nofication</button>
      </div>

      <RouterLink class="flex gap-3 hover:bg-primary p-4 rounded-md" to="/profile">
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
        'h-screen overflow-y-auto fixed left-24 transition-all duration-300 opacity-0 z-1',
        noficationShow ? 'w-96 opacity-100 boder-r border' : 'w-0'
      ]"
    >
      <span class="p-4 block font-bold text-2xl">Nofication</span>
      <span v-if="noficationStore.listNofications.length == 0">Chưa có thông báo!</span>
      <div class="p-4 flex flex-col gap-8">
        <RouterLink
          :to="`/`"
          v-for="(nofication, index) in noficationStore.listNofications"
          :key="index"
          class="flex gap-4"
        >
          <img :src="nofication.from.photoURL" alt="" class="h-8 w-8 rounded-full" />
          <div class="flex">
            <div>
              <span>{{ nofication.message }}</span>
              <p class="text-xs text-zinc-400">
                {{ formatDistance(nofication.createdAt, Date.now(), { addSuffix: true }) }}
              </p>
            </div>
            <img
              v-if="nofication.type == 'COMMENT' || nofication.type == 'LIKE'"
              :src="nofication.post?.imageUrl?.[0]"
              alt=""
              class="h-10 w-10"
            />
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
onMounted(() => {
  noficationStore.getNofications()
})
</script>
