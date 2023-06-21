<template>
  <leftSidebar />
  <div class="w-full ml-[16%] flex flex-col items-center pt-10 h-screen">
    <div class="w-6/12">
      <div class="flex gap-32">
        <img :src="userInfo.photoURL" alt="profile-img" class="w-32 h-32 rounded-full" />
        <div class="flex flex-col">
          <div class="flex gap-8 items-center">
            <span class="font-semibold text-lg">{{ userInfo.displayName }}</span>
            <button class="btn btn-primary btn-sm capitalize" @click="handleFollow">
              {{ follower.includes(auth.currentUser?.uid as string) ? 'following' : 'follow' }}
            </button>
          </div>
          <div class="flex gap-6 my-4">
            <span class="font-semibold text-base-content">{{ userPosts.length }} posts</span>
            <span>{{ follower.length }} follower</span>
            <span>{{ following.length }} following</span>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(post, index) in userPosts"
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
import { auth, db } from '@/firebase/config'
import { type UserInfo } from '@/store/useAuthStore'
import { useModalStore } from '@/store/useModalStore'
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  orderBy,
  where,
  setDoc,
  deleteDoc
} from 'firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import type { Post } from '@/types'
import { useNoficationStore } from '@/store/noficationStrore'

const modalStore = useModalStore()
const noficationStrore = useNoficationStore()
const router = useRouter()
const route = useRoute()
const userInfo = ref<UserInfo>({} as UserInfo)
const userPosts = ref<Post[]>([])
const follower = ref<string[]>([])
const following = ref<string[]>([])

const openModal = (postId: string) => {
  modalStore.setOpenViewPostModal(true)
  router.push({ name: 'other-profile', params: { id: postId } })
}

const getUserInfo = async (uid: string) => {
  const userRef = doc(db, 'users', uid)
  const user = await getDoc(userRef)
  userInfo.value = { ...(user.data() as UserInfo) }
}

const getFollow = () => {
  const followerRef = query(collection(db, `follow/${route.params.userUid}/userFollower`))
  onSnapshot(followerRef, (querySnapshot) => {
    follower.value = querySnapshot.docs.map((doc) => doc.id)
  })
  const followingRef = query(collection(db, `follow/${route.params.userUid}/userFollowing`))
  onSnapshot(followingRef, (querySnapshot) => {
    following.value = querySnapshot.docs.map((doc) => doc.id)
  })
}
const handleFollow = async () => {
  if (!follower.value.includes(auth.currentUser?.uid as string)) {
    setDoc(doc(db, `follow/${auth.currentUser?.uid}/userFollowing/${route.params.userUid}`), {})
    setDoc(doc(db, `follow/${route.params.userUid}/userFollower/${auth.currentUser?.uid}`), {})
    noficationStrore.createNofication(route.params.userUid as string, 'FOLLOW')
  } else {
    deleteDoc(doc(db, `follow/${auth.currentUser?.uid}/userFollowing/${route.params.userUid}`))
    deleteDoc(doc(db, `follow/${route.params.userUid}/userFollower/${auth.currentUser?.uid}`))
  }
}
const getUserPosts = (uid: string) => {
  const q = query(collection(db, `posts`), orderBy('time', 'desc'), where('userUid', '==', uid))
  onSnapshot(q, (querySnapshot) => {
    userPosts.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      userUid: doc.data().userUid,
      userDisplayName: doc.data().userDisplayName,
      userAvatar: doc.data().userAvatar,
      content: doc.data().content,
      imageUrl: doc.data().imageUrl,
      time: doc.data().time,
      comment: doc.data().comment,
      like: doc.data().like,
      postId: doc.id
    }))
  })
}
getUserInfo(route.params.userUid as string)
getUserPosts(route.params.userUid as string)
getFollow()
</script>
