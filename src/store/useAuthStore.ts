// auth.js
import { onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, getDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore'
import type { Post } from '@/types'

type UserInfo = {
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
  const router = useRouter()

  const getUserInfo = async (uid: string) => {
    const userRef = doc(db, 'users', uid)
    const user = await getDoc(userRef)
    userInfo.value = { ...(user.data() as UserInfo) }
  }
  const getUserPosts = (uid: string) => {
    const q = query(collection(db, `posts`), orderBy('time', 'desc'), where('userUid', '==', uid))
    onSnapshot(q, (querySnapshot) => {
      userPosts.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userUid: doc.data().userUid,
        userDisplayName: doc.data().userDisplayName,
        userAvatar: doc.data().photoURL,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
        time: doc.data().time,
        comment: doc.data().comment,
        like: doc.data().like,
        postId: doc.id
      }))
    })
  }
  const onAuthStateChange = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAuthenticated.value = true
        getUserInfo(user.uid)
        getUserPosts(user.uid)
        router.push('/')
      } else {
        isAuthenticated.value = false
        userInfo.value = {} as UserInfo
        router.push('/login')
      }
    })
  }
  return { isAuthenticated, userInfo, onAuthStateChange, userPosts }
})
