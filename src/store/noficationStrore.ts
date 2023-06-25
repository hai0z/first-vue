import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/config'
import type { UserInfo } from './useAuthStore'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
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
    const notificationRef = collection(db, `notifications/${recipientId}/userNotifications`)
    const notificationMessage = await generateNotificationMessage(type, post)
    if (recipientId !== auth.currentUser?.uid) {
      // người nhận phải khác với người gửi thì mới gửi thông báo
      // Kiểm tra xem đã có thông báo liên quan đến bài viết này chưa
      if (post != undefined) {
        const querySnapshot = await getDocs(
          query(
            notificationRef,
            where('post.postId', '==', post?.postId),
            where('type', '==', type)
          )
        )
        if (querySnapshot.empty) {
          // Tạo thông báo mới nếu không có thông báo liên quan đến bài viết này
          await addDoc(notificationRef, {
            message: notificationMessage,
            post,
            createdAt: Date.now(),
            from: {
              userName: auth.currentUser?.displayName as string,
              photoURL: auth.currentUser?.photoURL as string,
              uid: auth.currentUser?.uid
            },
            type,
            isRead: false
          })
        } else {
          // Cập nhật thông báo hiện có nếu đã có thông báo liên quan đến bài viết này
          const existingNotification = querySnapshot.docs[0]
          await updateDoc(doc(notificationRef, existingNotification.id), {
            message: notificationMessage,
            createdAt: Date.now(),
            isRead: false
          })
        }
      } else {
        //dành cho loại thông báo là follow
        await addDoc(notificationRef, {
          message: notificationMessage,
          post: {},
          createdAt: Date.now(),
          from: {
            userName: auth.currentUser?.displayName as string,
            photoURL: auth.currentUser?.photoURL as string,
            uid: auth.currentUser?.uid
          },
          type,
          isRead: false
        })
      }

      // Cập nhật số lượng thông báo của người nhận
      // số thông báo của người nhận sẽ là số thông báo chưa đọc
      const notificationUnRead = await getDocs(
        query(
          collection(db, `notifications/${recipientId}/userNotifications`),
          where('isRead', '==', false)
        )
      )
      await updateDoc(doc(db, 'users', recipientId), {
        noficationCount: notificationUnRead.size
      })
    }
  }

  const generateNotificationMessage = async (
    type: 'LIKE' | 'COMMENT' | 'FOLLOW',
    post?: Partial<Post>
  ) => {
    let message = ''
    switch (type) {
      case 'LIKE': {
        const likers = await getLikers(post?.postId as string) //lấy danh sách người đã thich bài viết
        if (likers.length === 1) {
          message = `${await getAuthorName(likers[0])} đã thích bài viết của bạn`
        } else if (likers.length === 2) {
          message = `${await getAuthorName(likers[0])} và ${await getAuthorName(
            likers[1]
          )} đã thích bài viết của bạn`
        } else if (likers.length > 2) {
          message = `${await getAuthorName(likers[0])} và ${
            likers.length - 1
          } người khác đã thích bài viết của bạn`
        }
        break
      }

      case 'COMMENT': {
        const comments = await getCommentor(post?.postId as string) //lấy ds người đã comment
        if (comments.length === 1) {
          message = `${await getAuthorName(comments[0])} đã bình luận về bài viết của bạn`
        } else if (comments.length === 2) {
          message = `${await getAuthorName(comments[0])} và ${await getAuthorName(
            comments[1]
          )} đã bình luận về bài viết của bạn`
        } else if (comments.length > 2) {
          message = `${await getAuthorName(comments[0])} và ${
            comments.length - 1
          } người khác đã bình luận về bài viết của bạn`
        }
        break
      }
      case 'FOLLOW':
        message = `${auth.currentUser?.displayName} đã bắt đầu theo dõi bạn`
        break
      default:
        break
    }
    return message
  }

  const getLikers = async (postId: string) => {
    const likesRef = query(collection(db, `posts`), where('postId', '==', postId))
    const querySnapshot = await getDocs(likesRef)
    const likers: string[] = []
    for (let i = 0; i < querySnapshot.docs[0].data().like.length; i++) {
      likers.push(querySnapshot.docs[0].data().like[i])
    }
    return likers
  }
  const getCommentor = async (postId: string) => {
    const commentRef = query(collection(db, `posts`), where('postId', '==', postId))
    const querySnapshot = await getDocs(commentRef)
    const comments: string[] = []
    const commentData = querySnapshot.docs[0].data().comment
    const uidSet = new Set()
    const uniqueUids: string[] = []

    commentData.forEach((comment: Post) => {
      if (!uidSet.has(comment.userUid) && comment.userUid !== auth.currentUser?.uid) {
        uidSet.add(comment.userUid)
        uniqueUids.push(comment.userUid)
      }
    }) // lọc ra số người đã comment vì 1 người có thế comment nhiều lần

    for (let i = 0; i < uniqueUids.length; i++) {
      comments.push(uniqueUids[i])
    }
    return comments
  }

  //lấy tên người dùng theo uid
  const getAuthorName = async (userUid: string) => {
    const userDoc = await getDoc(doc(db, 'users', userUid))
    const userName = userDoc.data()?.displayName || ''
    return userName
  }
  const getNofications = () => {
    const noficationRef = query(
      collection(db, `notifications/${auth.currentUser?.uid}/userNotifications`),
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

  //realtime listening khi có thông báo mới sẽ hiện lên toast
  const listeningNofication = (userId: string) => {
    const noficationRef = query(collection(db, `notifications/${userId}/userNotifications`))
    onSnapshot(noficationRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (
          change.type === 'added' ||
          (change.type === 'modified' && change.doc.data().isRead == false)
        ) {
          if (!isFirstConnection) {
            toast(
              `<div class="flex gap-4 items-center w-full"
              >
            <img src=${
              change.doc.data().from.photoURL
            } alt="" class="h-8 w-8 rounded-full object-cover" />
            <div class="flex items-center justify-center gap-4">
             
                <span class="w-full">${change.doc.data().message}</span>
             
              ${
                change.doc.data().type == 'COMMENT'
                  ? ` <img src=${
                      change.doc.data().post.imageUrl
                    } alt="" class="h-10 w-10 object-cover" />`
                  : ''
              }
              ${
                change.doc.data().type == 'LIKE'
                  ? ` <img src=${
                      change.doc.data().post.imageUrl
                    } alt="" class="h-10 w-10 object-cover" />`
                  : ''
              }
            </div>
          </div>`,
              {
                autoClose: 3000,
                dangerouslyHTMLString: true
              }
            )
          }
        }
      })
      isFirstConnection = false
    })
  }
  return {
    createNofication,
    getNofications,
    listNofications,
    listeningNofication,
    isFirstConnection
  }
})
