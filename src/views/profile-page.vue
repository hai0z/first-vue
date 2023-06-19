<template>
    <leftSidebar />
    <div class="w-full ml-[16%] flex flex-col items-center pt-10 h-screen">
        <div class="w-6/12">
            <div class="flex gap-32">
                <img :src="authStore.userInfo.photoURL" alt="profile-img" class="w-32 h-32 rounded-full">
                <div class="flex flex-col">
                    <span class="font-semibold text-lg">{{ authStore.userInfo.displayName }}</span>
                    <div class="flex gap-6 my-4">
                        <span class="font-semibold text-base-content">{{ authStore.userPosts.length }} posts</span>
                        <span>0 follower</span>
                        <span>0 following</span>
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="grid grid-cols-3 gap-2">
                <div v-for="(post, index) in authStore.userPosts" :key="index" class="cursor-pointer" @click="openModal(post.postId)">
                    <img :src="post.imageUrl[0]" alt="user-post" class="object-cover w-[300px] h-[300px]">
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import leftSidebar from '@/components/left-sidebar.vue';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import { useRouter } from 'vue-router';
export default {
    name: 'profile-page',
    components: { leftSidebar },
    setup() {
        const authStore = useAuthStore()
        const modalStore = useModalStore()
        const router = useRouter()
        const openModal = (postId: string) => {
            modalStore.setOpenViewPostModal(true)
            router.push(`/profile/p/${postId}`)
        }
        return { authStore, modalStore, openModal }
    }
}
</script>