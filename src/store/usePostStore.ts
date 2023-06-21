import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { defineStore } from 'pinia'
import type { Post } from '@/types'
import { useNoficationStore } from './noficationStrore'

export const usePostStore = defineStore('posts', () => {
  const noficationStore = useNoficationStore()

  const toggleLike = async (postId: string, likeItem: string) => {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const post = docSnap.data() as Post
      const likeIndex = post.like.indexOf(likeItem)

      if (likeIndex > -1) {
        // Nếu likeItem đã tồn tại trong mảng "like", xóa nó đi
        post.like = arrayRemove(likeItem) as any
      } else {
        // Nếu likeItem chưa tồn tại trong mảng "like", thêm nó vào
        post.like = arrayUnion(likeItem) as any
        console.log('Like added successfully.')
        noficationStore.createNofication(post.userUid, 'LIKE', post)
      }
      await updateDoc(docRef, { like: post.like })
    } else {
      console.log('Post not found.')
    }
  }
  const commentToPost = async (
    postId: string,
    commentObj: {
      userAvatar: string
      content: string
      userUid: string
      userDisplayName: string
      time: any
    }
  ) => {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const comment = docSnap.data().comment
      await updateDoc(docRef, { comment: [...comment, commentObj] })
      noficationStore.createNofication(docSnap.data().userUid, 'COMMENT', docSnap.data())
    } else {
      console.log('Post not found.')
    }
  }
  return { toggleLike, commentToPost }
})
