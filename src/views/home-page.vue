<template>
  <leftSidebar />
  <div class="lg:w-7/12 lg:ml-[18%] flex flex-col mt-10 items-end w-full">
    <div class="flex justify-center flex-col items-center lg:w-10/12 w-full">
      <div class="story h-20 flex flex-row items-center gap-5 lg:w-9/12 overflow-hidden w-full">
        <div v-for="(_, index) in fakeStory" :key="index" class="pt-1">
          <storyAvatar />
        </div>
      </div>
      <div class="mt-16 md:w-7/12 w-full px-4 lg:px-0" v-if="displayedPosts.length > 0">
        <div v-for="(post, index) in displayedPosts" :key="index">
          <userPost :post="post" />
        </div>
      </div>
      <div
        v-else
        class="lg:w-7/12 justify-center items-center h-[calc(100%-80px)] flex pt-4 w-full"
      >
        <p class="font-semibold">Chưa có bài đăng</p>
      </div>
    </div>
  </div>
  <rightSidebar />
</template>
<script lang="ts" setup>
import storyAvatar from '../components/story-avatar.vue'
import leftSidebar from '../components/left-sidebar.vue'
import rightSidebar from '../components/right-sidebar.vue'
import userPost from '../components/user-post.vue'
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'

const fakeStory = ref([1, 2, 3, 4, 5, 6, 7, 8])
const authStore = useAuthStore()

const displayedPostsCount = ref(3)

const loadMorePosts = () => {
  displayedPostsCount.value += 3
}

const displayedPosts = computed(() => {
  return authStore.followingPost.slice(0, displayedPostsCount.value)
})
const handleScroll = () => {
  const scrollPosition = window.scrollY
  const documentHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight

  if (scrollPosition + windowHeight >= documentHeight) {
    loadMorePosts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>
