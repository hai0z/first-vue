type Post = {
  userUid: string
  userDisplayName: string
  userAvatar: string
  content: string
  imageUrl: string[]
  time: Date
  comment: {
    userAvatar: string
    content: string
    userUid: string
    userDisplayName: string
    time: Date
  }[]
  like: string[]
  postId: string
}
export { type Post }
