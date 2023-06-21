<template>
  <leftSidebar />
  <div class="w-full ml-[16%] flex flex-col items-center pt-10 h-screen">
    <div class="w-6/12">
      <div class="flex gap-32">
        <img :src="authStore.userInfo.photoURL" alt="profile-img" class="w-32 h-32 rounded-full" />
        <div class="flex flex-col">
          <span class="font-semibold text-lg">{{ authStore.userInfo.displayName }}</span>
          <div class="flex gap-6 my-4">
            <span class="font-semibold text-base-content"
              >{{ authStore.userPosts.length }} posts</span
            >
            <span>0 follower</span>
            <span>0 following</span>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(post, index) in authStore.userPosts"
          :key="index"
          class="cursor-pointer"
          @click="openModal(post.postId)"
        >
          <div class="relative group">
            <img
              :src="post.imageUrl[0]"
              alt="user-post"
              class="object-cover w-[300px] h-[300px] transition-all duration-200 group-hover:brightness-50"
              loading="lazy"
            />
            <div
              class="absolute h-full w-full top-0 left-0 opacity-0 transition-all duration-200 group-hover:opacity-100 flex justify-center items-center gap-4"
            >
              <div :class="['fa-heart text-2xl cursor-pointer fa-solid text-white']"></div>
              <span class="text-white"> {{ post.like.length }} </span>
              <i class="fa-regular fa-comment text-2xl cursor-pointer text-white"></i>
              <span class="text-white">{{ post.comment.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import leftSidebar from '@/components/left-sidebar.vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useModalStore } from '@/store/useModalStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const modalStore = useModalStore()
const router = useRouter()
const openModal = (postId: string) => {
  modalStore.setOpenViewPostModal(true)
  router.push({ name: 'profile', params: { id: postId } })
}
</script>
