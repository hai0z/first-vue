import { query, updateDoc, writeBatch } from 'firebase/firestore'
// auth.js
import { onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore'
import type { Post } from '@/types'

export type UserInfo = {
  displayName: string
  email: string
  photoURL: string
  uid: string
  userName: string
  noficationCount?: number
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
    const q = doc(db, 'users', uid)
    onSnapshot(q, (querySnapshot) => {
      userInfo.value = { ...(querySnapshot.data() as UserInfo) }
    })
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
  const updateNoficationCount = async () => {
    const notificationRef = collection(
      db,
      `notifications/${auth.currentUser?.uid}/userNotifications`
    )
    const q = query(notificationRef, where('isRead', '==', false))
    const querySnapshot = await getDocs(q)
    const batch = writeBatch(db)
    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(notificationRef, docSnapshot.id)
      batch.update(docRef, { isRead: true })
    })
    await batch.commit()
    const userRef = doc(db, 'users', auth.currentUser?.uid as string)
    await updateDoc(userRef, {
      noficationCount: 0
    })
    console.log('Đã cập nhật thành công')
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
        loading.value = false
        router.push('/')
      } else {
        isAuthenticated.value = false
        userInfo.value = {} as UserInfo
        userPosts.value = []
        suggestUser.value = []
        loading.value = false

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
    loading,
    updateNoficationCount
  }
})
