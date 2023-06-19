<template>
    <Presence>
        <div v-show="modalStore.viewPostModalOpen"
            :class="['fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-brightness-50 transition-all duration-300']">
            <span class="absolute top-4 right-8 text-white text-3xl cursor-pointer" @click="handleCloseModal">x</span>
            <Motion v-if="post.postId" :initial="{ opacity: 0, scale: 1.2 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.1 }"
                :exit="{ opacity: 0, scale: 1.2 }" class="w-8/12 h-[95%] bg-base-100 flex rounded-sm">
                <div class="w-2/3 bg-black">
                    <img :src="post?.imageUrl[0]" alt="" class="w-full object-contain h-full">
                </div>
                <div class="w-[550px] flex flex-col pl-4 py-3">
                    <div class="flex flex-row gap-2 items-center">
                        <img :src="post.userAvatar" class="h-10 w-10 rounded-full" />
                        <span class="font-semibold">{{ post.userDisplayName }}</span>

                    </div>
                    <div class="divider"></div>
                    <div class="comment flex-[4] overflow-y-auto">
                        <div class="flex flex-row items-center" v-if="post.content">
                            <img :src="post.userAvatar" alt="" class="h-10 w-10 rounded-full">
                            <div class="ml-2">
                                <span class="font-semibold">{{ post.userDisplayName }}</span>{{ " " }}
                                <span> {{ post.content }}</span>
                                <p class="text-zinc-500 text-sm">{{ formatDistance(post.time, Date.now()) }}</p>
                            </div>
                        </div>
                        <div v-for="(comment, index) in post.comment " :key="index" class="flex flex-row items-center my-8">
                            <img :src="comment.userAvatar" alt="" class="h-10 w-10 rounded-full">
                            <div class="ml-2">
                                <span class="font-semibold">{{ post.userDisplayName }}</span>{{ " " }}
                                <span> {{ comment.content }}</span>
                                <p class="text-zinc-500 text-sm">{{ formatDistance(comment.time, Date.now()) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="flex-1 flex flex-col">
                        <div class="flex gap-4 w-full">
                            <div class="space-x-4">
                                <i :class='["fa-heart text-2xl cursor-pointer", post.like.includes(auth.currentUser?.uid + "") ? "fa-solid text-[rgb(255,48,64)]" : "fa-regular"]'
                                    @click="postStore.toggleLike(post.postId, auth.currentUser?.uid as string)"></i>

                                <i class="fa-regular fa-comment text-2xl cursor-pointer" @click="commentRef.focus()"></i>
                                <i class="fa-regular fa-paper-plane text-2xl"></i>
                            </div>
                            <i class="fa-regular fa-bookmark ml-auto text-2xl mr-4"></i>
                        </div>
                        <div>
                            <span class="font-semibold">{{ post.like.length }}{{ " " }}</span>
                            <span>likes</span>
                            <p class="text-zinc-500 text-sm">{{ formatDistance(post.time, Date.now()) }}</p>
                        </div>
                        <div class="divider"></div>
                        <div class="flex justify-between">
                            <textarea type="text" ref="commentRef" class="outline-none w-full" placeholder="Add a comment..." v-model="input"></textarea>
                            <button class="btn btn-link" v-show="input.trim().length > 0" @click="handleComment">Post</button>
                        </div>
                    </div>
                </div>
            </Motion>
        </div>
    </Presence>
</template>
<script lang="ts">
import { useModalStore } from '@/store/useModalStore';
import { usePostStore } from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Motion, Presence } from 'motion/vue'
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onSnapshot, doc, } from "firebase/firestore";
import type { Post } from '@/types';
import { auth, db } from '@/firebase/config';
import { formatDistance } from 'date-fns'

export default {
    name: 'viewPost',
    components: { Motion, Presence },
    setup() {
        const modalStore = useModalStore()
        const route = useRoute()
        const router = useRouter()
        const post = ref<Post>({} as Post)
        const postStore = usePostStore()
        const authStore = useAuthStore()
        const input = ref('')
        const commentRef = ref<any>()
        const handleCloseModal = () => {
            router.back()
            modalStore.setOpenViewPostModal(false)
            post.value = {} as Post
            document.body.style.overflowY = 'scroll'
            input.value = ""
        }
        const handleComment = () => {
            postStore.commentToPost(post.value.postId, {
                userAvatar: authStore.userInfo.photoURL,
                content: input.value,
                userUid: authStore.userInfo.uid,
                time: Date.now(),
                userDisplayName: authStore.userInfo.displayName

            })
            input.value = ""
        }
        watch(
            () => route.params.id,
            async (newVal) => {
                onSnapshot(doc(db, `posts/${newVal}`), (doc) => {
                    post.value = doc.data() as Post;
                });
            }
        );
        return {
            modalStore, handleCloseModal, post, formatDistance, postStore, auth, input, handleComment, commentRef
        }
    }
}
</script>