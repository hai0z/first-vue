<template>
    <div class="w-4/12 h-screen hidden lg:flex py-14 flex-col">
        <div class="flex items-center w-9/12">
            <RouterLink to="/profile">
                <img :src="authStore.userInfo.photoURL" alt="" class="h-16 w-16 rounded-full object-cover">
            </RouterLink>
            <div class="flex flex-col ml-2">
                <RouterLink to="/profile">
                    <span class="font-semibold">{{ authStore.userInfo.displayName }}</span>
                </RouterLink>
                <span class="text-gray-500">{{ authStore.userInfo.userName }}</span>
            </div>
        </div>
        <div class="py-2 w-9/12">
            <p class="font-semibold text-gray-500">Suggested for you</p>
            <div v-for="user in authStore.suggestUser.slice(0, 4)" :key="user.uid" class="w-9/12 py-2 space-y-2">
                <RouterLink :to="`/profile/${user.uid}`" class="flex h-fit w-full items-center">
                    <img :src='user.photoURL' alt="" class="h-8 w-8 rounded-full object-cover">
                    <div class="flex flex-col ml-2">
                        <span class="font-semibold text-xs">{{ user.displayName }}</span>
                        <span class="text-gray-500 text-xs">{{ user.userName }}</span>
                    </div>
                    <span class="text-primary ml-auto">follow</span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { useAuthStore } from '@/store/useAuthStore';

export default {
    name: 'right-sidebar',
    setup() {
        const authStore = useAuthStore()
        return { authStore }
    }
}
</script>