<template>
    <leftSidebar />
    <div class="w-7/12 ml-[18%] flex flex-col mt-10 items-end">
        <div class="flex justify-center flex-col items-center w-10/12">
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
    </div>
    <rightSidebar />
    <likeModal />
</template>
<script lang="ts">

import storyAvatar from '../components/story-avatar.vue';
import leftSidebar from '../components/left-sidebar.vue';
import rightSidebar from '../components/right-sidebar.vue'
import userPost from '../components/user-post.vue';
import likeModal from '@/components/modal/like-modal.vue';
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';

export default {
    name: 'App',
    components: { storyAvatar, leftSidebar, rightSidebar, userPost, likeModal },
    setup() {
        const fakeStory = ref([1, 2, 3, 4, 5, 6, 7, 8])
        const authStore = useAuthStore()

        const displayedPostsCount = ref(3);

        const loadMorePosts = () => {
            displayedPostsCount.value += 3;
        };

        const displayedPosts = computed(() => {
            return authStore.followingPost.slice(0, displayedPostsCount.value);
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