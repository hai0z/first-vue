<template>
    <dialog :class="['modal', modalStore.createModalOpen && 'modal-open']">
        <form method="dialog" :class="['modal-box transition-all duration-300 h-[70vh]', selectedImage && 'max-w-5xl']">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleCloseModal">✕</button>
            <h3 class="font-bold text-lg text-center">Create new post </h3>
            <div className="border-b"></div>
            <div v-if="!selectedImage" class="flex flex-col justify-center items-center h-[90%]">
                <input type="file" @change="handleFileSelect" accept="image/*" class="file-input" hidden ref="fileInputRef">
                <span>No file choosen</span>
                <button class="btn btn-link" @click="openFileInput">Select from computer</button>
            </div>
            <div v-else-if="selectedImage" class="flex h-[95%]">
                <div class="w-2/3 bg-black/50 flex justify-center items-center">
                    <img :src="selectedImage" alt="Selected Image" class="object-contain h-full" />
                </div>
                <div class="w-1/3 flex flex-col">
                    <div class="flex gap-2 items-center p-4">
                        <img :src="authStore.userInfo.photoURL" alt="" class="w-10 h-10 rounded-full">
                        <span class="font-semibold">{{ authStore.userInfo.displayName }}</span>
                    </div>
                    <textarea name="" id="" cols="30" rows="10" placeholder="Write a caption..." class="m-2 p-2 focus:outline-none"
                        v-model="caption"></textarea>
                    <button :class="['btn btn-link mx-2 my-2']" @click="handleAddPost"> <span
                            :class="[loading && 'loading loading-spinner']"></span>Post</button>
                </div>
            </div>
        </form>
    </dialog>
</template>

<script lang="ts">
import { useModalStore } from '@/store/useModalStore'
import { ref } from 'vue'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../../firebase/config'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/store/useAuthStore'
export default {
    name: 'createModal',
    setup() {
        const selectedImage = ref<any>(null)
        const caption = ref<string>('')
        const modalStore = useModalStore()
        const loading = ref<boolean>(false)
        const authStore = useAuthStore()
        const fileInputRef = ref<any>(null);

        const openFileInput = () => {
            fileInputRef.value?.click();
        };
        const handleFileSelect = (event: any) => {
            const file = event.target.files[0];

            if (file && file.type.includes('image')) {
                const reader = new FileReader();

                reader.onload = () => {
                    selectedImage.value = reader.result;
                };

                reader.readAsDataURL(file);
            }
        }
        const handleCloseModal = () => {
            modalStore.setOpenCreateModal(false)
            selectedImage.value = null
        }
        const handleAddPost = async () => {
            loading.value = true
            const fileRef = storageRef(storage, `/user1/post/${Math.random().toString(36)}`);
            const response = await fetch(selectedImage.value);
            const blob = await response.blob();
            uploadBytes(fileRef, blob).then(async () => {
                const url = await getDownloadURL(fileRef)
                const postRef = collection(db, `posts`);
                const newRef = doc(postRef)
                await setDoc(newRef, {
                    userDisplayName: authStore.userInfo.displayName,
                    userUid: auth.currentUser?.uid,
                    userAvatar: authStore.userInfo.photoURL,
                    content: caption.value,
                    imageUrl: [url],
                    like: [],
                    comment: [],
                    time: Date.now(),
                    postId: newRef.id
                });
                loading.value = false
                selectedImage.value = null
                modalStore.setOpenCreateModal(false)
                caption.value = ""
            })
        }
        return {
            selectedImage,
            handleFileSelect,
            modalStore,
            handleCloseModal,
            handleAddPost,
            loading,
            caption,
            authStore,
            fileInputRef,
            openFileInput
        }
    }
}
</script>

<style></style>