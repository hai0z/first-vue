import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { defineStore } from 'pinia'
import type { Post } from '@/types'
export const usePostStore = defineStore('posts', () => {
  const toggleLike = async (postId: string, likeItem: string) => {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const post = docSnap.data() as Post
      const likeIndex = post.like.indexOf(likeItem)

      if (likeIndex > -1) {
        // Nếu likeItem đã tồn tại trong mảng "like", xóa nó đi
        post.like = arrayRemove(likeItem) as any
        console.log('Like removed successfully.')
      } else {
        // Nếu likeItem chưa tồn tại trong mảng "like", thêm nó vào
        post.like = arrayUnion(likeItem) as any
        console.log('Like added successfully.')
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
    } else {
      console.log('Post not found.')
    }
  }
  return { toggleLike, commentToPost }
})
