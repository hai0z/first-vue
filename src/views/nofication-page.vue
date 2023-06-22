<template>
  <div class="w-full">
    <leftSidebar />
    <div class="pl-[18%] flex justify-center h-[80vh]" v-if="!loading">
      <div
        class="w-8/12 bg-base-100 mt-10 flex bg-gradient-to-br from-[#8a3ab9] via-[ #bc2a8d] to-[#fbad50] flex rounded-sm p-[1px]"
      >
        <div class="w-2/3 bg-black">
          <img :src="post?.imageUrl[0]" alt="" class="w-full h-full object-contain" />
        </div>
        <div class="w-1/3 bg-blue-300">
          <div class="flex flex-col pl-4 py-3 h-full bg-base-100">
            <div class="flex flex-row gap-2 items-center">
              <img :src="post?.userAvatar" class="h-10 w-10 rounded-full" />
              <span class="font-semibold">{{ post?.userDisplayName }}</span>
            </div>
            <div class="divider"></div>
            <div class="comment flex-[4] overflow-y-auto">
              <div class="flex flex-row items-center" v-if="post?.content">
                <img :src="post.userAvatar" alt="" class="h-10 w-10 rounded-full" />
                <div class="ml-2">
                  <span class="font-semibold">{{ post.userDisplayName }}</span
                  >{{ ' ' }}
                  <span> {{ post.content }}</span>
                  <p class="text-zinc-500 text-sm">{{ formatDistance(post.time, Date.now()) }}</p>
                </div>
              </div>
              <div
                v-for="(comment, index) in post?.comment"
                :key="index"
                class="flex flex-row items-center my-8"
              >
                <img :src="comment.userAvatar" alt="" class="h-10 w-10 rounded-full" />
                <div class="ml-2">
                  <span class="font-semibold">{{ post?.userDisplayName }}</span
                  >{{ ' ' }}
                  <span> {{ comment.content }}</span>
                  <p class="text-zinc-500 text-sm">
                    {{ formatDistance(comment.time, Date.now()) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="flex-1 flex flex-col">
              <div class="flex gap-4 w-full">
                <div class="space-x-4">
                  <i
                    :class="[
                      'fa-heart text-2xl cursor-pointer',
                      post?.like.includes(auth.currentUser?.uid + '')
                        ? 'fa-solid text-[rgb(255,48,64)]'
                        : 'fa-regular'
                    ]"
                    @click="
                      postStore.toggleLike(post?.postId as string, auth.currentUser?.uid as string)
                    "
                  ></i>

                  <i
                    class="fa-regular fa-comment text-2xl cursor-pointer"
                    @click="commentRef.focus()"
                  ></i>
                  <i class="fa-regular fa-paper-plane text-2xl"></i>
                </div>
                <i class="fa-regular fa-bookmark ml-auto text-2xl mr-4"></i>
              </div>
              <div
                @click="
                  () => {
                    modalStore.likeArr = post?.like
                    modalStore.likeModalOpen = true
                  }
                "
                class="cursor-pointer"
              >
                <span class="font-semibold">{{ post?.like.length }}{{ ' ' }}</span>
                <span>likes</span>
                <p class="text-zinc-500 text-sm">
                  {{ formatDistance(post?.time as any, Date.now()) }}
                </p>
              </div>
              <div class="divider"></div>
              <div class="flex justify-between">
                <textarea
                  type="text"
                  ref="commentRef"
                  class="outline-none w-full"
                  placeholder="Add a comment..."
                  v-model="input"
                ></textarea>
                <button
                  class="btn btn-link"
                  v-show="input.trim().length > 0"
                  @click="handleComment"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import leftSidebar from '@/components/left-sidebar.vue'
import { usePostStore } from '@/store/usePostStore'
import type { Post } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formatDistance } from 'date-fns'
import { auth, db } from '@/firebase/config'
import { useAuthStore } from '@/store/useAuthStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { useModalStore } from '@/store/useModalStore'

const route = useRoute()
const postStore = usePostStore()
const post = ref<Post | undefined>({} as Post)
const loading = ref(true)
const authStore = useAuthStore()
const input = ref('')
const commentRef = ref<any>()
const modalStore = useModalStore()

const handleComment = () => {
  postStore.commentToPost(post.value?.postId as string, {
    userAvatar: authStore.userInfo.photoURL,
    content: input.value,
    userUid: authStore.userInfo.uid,
    time: Date.now(),
    userDisplayName: authStore.userInfo.displayName
  })
  input.value = ''
}
watch(
  () => route.params.id,
  () => {
    const docRef = doc(db, 'posts', route.params.id as string)
    if (route.params.id != undefined) {
      onSnapshot(docRef, (snapShot) => (post.value = snapShot.data() as Post))
    }
    loading.value = false
  }
)
onMounted(async () => {
  const docRef = doc(db, 'posts', route.params.id as string)
  if (route.params.id != undefined) {
    onSnapshot(docRef, (snapShot) => (post.value = snapShot.data() as Post))
  }
  loading.value = false
})
</script>
