import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/config'
import type { UserInfo } from './useAuthStore'
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { ref } from 'vue'
import type { Post } from '@/types'
import { toast } from 'vue3-toastify'
interface INofication {
  message: string
  type: 'LIKE' | 'COMMENT' | 'FOLLOW'
  post?: Partial<Post>
  from: Partial<UserInfo>
  isRead: boolean
  createdAt: any
}

export const useNoficationStore = defineStore('nofications', () => {
  const listNofications = ref([] as INofication[])
  let isFirstConnection = true
  const createNofication = async (
    recipientId: string,
    type: 'LIKE' | 'COMMENT' | 'FOLLOW',
    post?: Partial<Post>
  ) => {
    const noficationRef = collection(db, `nofications/${recipientId}/userNofication`)
    const nofication = ref({} as INofication)
    switch (type) {
      case 'LIKE':
        nofication.value = {
          message: `${auth.currentUser?.displayName} đã thích ảnh của bạn`,
          post,
          createdAt: Date.now(),
          from: {
            userName: auth.currentUser?.displayName as string,
            photoURL: auth.currentUser?.photoURL as string,
            uid: auth.currentUser?.uid
          },
          type,
          isRead: false
        }
        break
      case 'COMMENT':
        nofication.value = {
          message: `${auth.currentUser?.displayName} đã bình luận về bài viết của bạn`,
          post,
          createdAt: Date.now(),
          from: {
            userName: auth.currentUser?.displayName as string,
            photoURL: auth.currentUser?.photoURL as string,
            uid: auth.currentUser?.uid
          },
          type,
          isRead: false
        }
        break
      case 'FOLLOW':
        nofication.value = {
          message: `${auth.currentUser?.displayName} đã bắt đầu theo dõi bạn`,
          post: {},
          createdAt: Date.now(),
          from: {
            userName: auth.currentUser?.displayName as string,
            photoURL: auth.currentUser?.photoURL as string,
            uid: auth.currentUser?.uid
          },
          type,
          isRead: false
        }
        break
      default:
        nofication.value = {} as INofication
    }
    if (recipientId != auth.currentUser?.uid) {
      await addDoc(noficationRef, nofication.value)
    }
  }
  const getNofications = () => {
    const noficationRef = query(
      collection(db, `nofications/${auth.currentUser?.uid}/userNofication`),
      orderBy('createdAt', 'desc')
    )
    onSnapshot(noficationRef, (querySnapshot) => {
      listNofications.value = querySnapshot.docs.map((nofication) => ({
        message: nofication.data().message,
        type: nofication.data().type,
        post: nofication.data().post,
        from: nofication.data().from,
        isRead: nofication.data().isRead,
        createdAt: nofication.data().createdAt
      }))
    })
  }

  const listeningNofication = (userId: string) => {
    const noficationRef = query(collection(db, `nofications/${userId}/userNofication`))
    onSnapshot(noficationRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          if (!isFirstConnection) {
            toast(
              `<div class="flex gap-4 items-center"
              >
            <img src=${change.doc.data().from.photoURL} alt="" class="h-8 w-8 rounded-full" />
            <div class="flex items-center justify-center">
             
                <span>${change.doc.data().message}</span>
             
              ${
                change.doc.data().type == 'COMMENT'
                  ? ` <img src=${change.doc.data().post.imageUrl} alt="" class="h-10 w-10" />`
                  : ''
              }
              ${
                change.doc.data().type == 'LIKE'
                  ? ` <img src=${change.doc.data().post.imageUrl} alt="" class="h-10 w-10" />`
                  : ''
              }
            </div>
          </div>`,
              {
                autoClose: 5000,
                dangerouslyHTMLString: true
              }
            )
          }
        }
      })

      isFirstConnection = false
    })
  }
  return { createNofication, getNofications, listNofications, listeningNofication }
})
