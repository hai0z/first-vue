<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="flex flex-col mb-6">
    <div class="post-header flex flex-row justify-between mb-2 items-center">
      <div class="flex flex-row items-center">
        <img :src="post.userAvatar" class="h-10 w-10 rounded-full" />
        <span class="font-semibold text-base-content text-sm ml-2">
          <RouterLink
            :to="`${
              post.userUid == auth.currentUser?.uid ? '/profile' : `/profile/${post.userUid}`
            }`"
          >
            {{ post?.userDisplayName }}
          </RouterLink>
          <span class="text-gray-400 font-normal">
            • {{ formatDistance(post.time, new Date(), { addSuffix: true }) }}
          </span>
        </span>
      </div>
      <i class="fa-solid fa-ellipsis text-lg cursor-pointer"></i>
    </div>
    <img :src="post.imageUrl[0]" class="object-cover rounded-sm w-full" loading="lazy" />
    <div class="post-action flex flex-row items-center py-2">
      <div class="flex gap-4">
        <i
          :class="[
            'fa-heart text-2xl cursor-pointer z-1',
            post.like.includes(auth.currentUser?.uid + '')
              ? 'fa-solid text-[rgb(255,48,64)]'
              : 'fa-regular'
          ]"
          @click="handleLikePost"
        ></i>
        <i
          class="fa-regular fa-comment text-2xl cursor-pointer"
          @click="handleClick(post.postId)"
        ></i>
        <i class="fa-regular fa-paper-plane text-2xl"></i>
      </div>
      <i class="fa-regular fa-bookmark ml-auto text-2xl"></i>
    </div>
    <div class="post-info">
      <span
        class="font-semibold text-base-content cursor-pointer"
        @click="handleViewLikePost(post.like)"
        >{{ post?.like.length }} likes</span
      >
      <p class="line-clamp-2">
        <RouterLink
          :to="`${post.userUid == auth.currentUser?.uid ? '/profile' : `/profile/${post.userUid}`}`"
          class="font-semibold text-base-content"
          >{{ post?.userDisplayName }}</RouterLink
        >
        {{ post?.content }}
      </p>
      <button class="text-zinc-400" @click="handleClick(post.postId)">
        View {{ post.comment.length }} comment
      </button>
      <div
        v-for="(comment, index) in post.comment.sort((a, b) => +b.time - +a.time).slice(0, 2)"
        :key="index"
      >
        <div>
          <span class="font-semibold">{{ comment.userDisplayName }}</span> {{ comment.content }}
        </div>
      </div>
      <div class="relative mt-3">
        <input
          type="text"
          placeholder="Add a comment..."
          class="w-full border-none focus:border-none focus:outline-none input p-0 z-1"
          v-model="input"
        />
        <button
          class="btn btn-link absolute right-0 top-0"
          v-show="input.trim().length > 0"
          @click="handleComment"
        >
          post
        </button>
      </div>
      <p class="w-full border-b border-gray-300 py-2"></p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useModalStore } from '@/store/useModalStore'
import { usePostStore } from '@/store/usePostStore'
import type { Post } from '@/types'
import { ref, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { formatDistance } from 'date-fns'
import { auth } from '@/firebase/config'

import { useAuthStore } from '@/store/useAuthStore'

const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  }
})
const modalStore = useModalStore()
const postStore = usePostStore()
const router = useRouter()
const authStore = useAuthStore()

const input = ref('')
const handleClick = (postId: string) => {
  modalStore.setOpenViewPostModal(true)
  router.push({ name: 'p', params: { id: postId } })
  document.body.style.overflow = 'hidden'
}
const handleComment = () => {
  postStore.commentToPost(props.post.postId, {
    userAvatar: authStore.userInfo.photoURL,
    content: input.value,
    userUid: authStore.userInfo.uid,
    time: Date.now(),
    userDisplayName: authStore.userInfo.displayName
  })
  input.value = ''
}
const handleViewLikePost = (likeArr: string[]) => {
  modalStore.likeModalOpen = true
  modalStore.likeArr = likeArr
}
const handleLikePost = () => {
  postStore.toggleLike(props.post.postId, auth.currentUser?.uid as string)
}
</script>
