<template>
    <leftSidebar />
    <div class="w-6/12 ml-[16%] flex flex-col items-center mt-10">
        <div class="story h-20 flex flex-row items-center gap-5 w-9/12 overflow-hidden">
            <div v-for="(_, index) in fakeStory" :key="index">
                <storyAvatar />
            </div>
        </div>
        <div class="mt-16 w-7/12" v-if="displayedPosts.length > 0">
            <div v-for="(post, index) in displayedPosts" :key='index'>
                <userPost :post="post" />
            </div>
        </div>
        <div v-else class="w-7/12ustify-center items-center h-[calc(100%-80px)] flex pt-4">
            <p class="font-semibold">Chưa có bài đăng</p>
        </div>
    </div>
    <rightSidebar />
</template>
<script lang="ts">

import storyAvatar from '../components/story-avatar.vue';
import leftSidebar from '../components/left-sidebar.vue';
import rightSidebar from '../components/right-sidebar.vue'
import userPost from '../components/user-post.vue';
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';

export default {
    name: 'App',
    components: { storyAvatar, leftSidebar, rightSidebar, userPost },
    setup() {
        const fakeStory = ref([1, 2, 3, 4, 5, 6, 7, 8])
        const authStore = useAuthStore()

        const displayedPostsCount = ref(3);

        const loadMorePosts = () => {
            displayedPostsCount.value += 3;
        };

        const displayedPosts = computed(() => {
            return authStore.userPosts.slice(0, displayedPostsCount.value);
        });
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;

            if (scrollPosition + windowHeight >= documentHeight) {
                loadMorePosts();
            }
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });
        return {
            fakeStory, authStore, displayedPosts
        }
    }
}
</script>