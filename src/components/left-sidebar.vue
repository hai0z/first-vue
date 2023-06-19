<template>
    <div class="w-[16%] border-r-[0.5px] h-screen fixed px-4 py-8">
        <img class="object-cover w-28" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
            alt="">
        <div class="mt-8 space-y-3">
            <RouterLink to="/" class="flex gap-3 hover:bg-zinc-200 rounded-md p-4">
                <svg aria-label="Home" class="_ab6-" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none"
                        stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
                <span class="font-bold">Home</span>
            </RouterLink>
            <div class="flex gap-3 hover:bg-zinc-200 p-4 rounded-md cursor-pointer" @click="() => modalStore.setOpenCreateModal(true)">
                <svg aria-label="New post" class="_ab6-" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <path
                        d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455"
                        y1="12.001" y2="12.001"></line>
                    <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003"
                        y1="6.545" y2="17.455"></line>
                </svg>
                <button>Create</button>
            </div>
            <RouterLink class="flex gap-3 hover:bg-zinc-200 p-4 rounded-md" to="/profile">
                <img :src="authStore.userInfo.photoURL" class="h-7 w-7 rounded-full" />
                <span>{{ authStore.userInfo.displayName }}</span>
            </RouterLink>
            <div class="flex gap-3 hover:bg-zinc-200 rounded-md">
                <button @click="auth.signOut" class="btn btn-link">Logout</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { auth } from '@/firebase/config';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';

export default {
    name: 'left-sidebar',
    setup() {
        const modalStore = useModalStore()
        const authStore = useAuthStore()
        return {
            modalStore,
            auth,
            authStore
        }
    }
}
</script>