// auth.js
import { onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs
} from 'firebase/firestore'
import type { Post } from '@/types'

export type UserInfo = {
  displayName: string
  email: string
  photoURL: string
  uid: string
  userName: string
}
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userInfo = ref<UserInfo>({} as UserInfo)
  const userPosts = ref<Post[]>([])
  const loading = ref(true)
  const router = useRouter()

  const suggestUser = ref<UserInfo[]>([])
  const followingPost = ref<Post[]>([])

  const getUserInfo = async (uid: string) => {
    const userRef = doc(db, 'users', uid)
    const user = await getDoc(userRef)
    userInfo.value = { ...(user.data() as UserInfo) }
    loading.value = false
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
  const fetchFollowingPost = () => {
    onSnapshot(
      query(collection(db, 'follow', `${auth.currentUser?.uid}/userFollowing`)),
      (querySnapshot) => {
        const following: string[] = querySnapshot.docs.map((doc) => {
          return doc.id
        })
        if (following.length >= 0) {
          onSnapshot(
            query(
              collection(db, 'posts'),
              where('userUid', 'in', [...following, auth.currentUser?.uid]),
              orderBy('time', 'desc')
            ),
            (querySnapshot) => {
              followingPost.value = querySnapshot.docs.map((doc) => ({
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
            }
          )
        }
      }
    )
  }

  const getSuggestUser = async () => {
    const q = query(collection(db, 'users'), where('uid', '!=', auth.currentUser?.uid))
    const querySnapshot = await getDocs(q)
    suggestUser.value = querySnapshot.docs.map((doc) => ({
      displayName: doc.data().displayName,
      email: doc.data().email,
      photoURL: doc.data().photoURL,
      uid: doc.data().uid,
      userName: doc.data().userName
    }))
  }
  const onAuthStateChange = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true
        getUserInfo(user.uid)
        getUserPosts(user.uid)
        getSuggestUser()
        fetchFollowingPost()
        router.push('/')
      } else {
        isAuthenticated.value = false
        userInfo.value = {} as UserInfo
        userPosts.value = []
        suggestUser.value = []
        router.push('/login')
      }
    })
  }
  return {
    isAuthenticated,
    userInfo,
    onAuthStateChange,
    userPosts,
    suggestUser,
    followingPost,
    loading
  }
})
