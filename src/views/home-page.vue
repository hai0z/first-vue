<template>
    <leftSidebar />
    <div class="w-6/12 ml-[16%] flex flex-col items-center mt-10">
        <div class="story h-20 flex flex-row items-center gap-5 w-9/12 overflow-hidden">
            <div v-for="(_, index) in fakeStory" :key="index">
                <storyAvatar />
            </div>
        </div>
        <div class="mt-16 w-7/12">
            <div v-for="(post, index) in fakePost" :key='index'>
                <userPost />
            </div>
        </div>
    </div>
    <rightSidebar />
    <createModal />
</template>
<script lang="ts">

import storyAvatar from '../components/story-avatar.vue';
import leftSidebar from '../components/left-sidebar.vue';
import rightSidebar from '../components/right-sidebar.vue'
import userPost from '../components/user-post.vue';
import createModal from '../components/modal/create-modal.vue'
import { ref } from 'vue';

export default {
    name: 'App',
    components: { storyAvatar, leftSidebar, rightSidebar, userPost, createModal },
    setup() {
        const fakeStory = ref([1, 2, 3, 4, 5, 6, 7, 8])
        const fakePost = ref([1, 2, 3, 4, 5, 6, 7, 8])
        return {
            fakeStory, fakePost
        }
    }
}
</script>