<template>
    <dialog :class="['modal', modalStore.createModalOpen && 'modal-open']">
        <form method="dialog" :class="['modal-box transition-all duration-300 h-[70vh]', selectedImage && 'w-11/12 max-w-4xl']">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleCloseModal">✕</button>
            <h3 class="font-bold text-lg text-center">Create new post </h3>
            <div className="border-b"></div>
            <div v-if="!selectedImage" class="flex justify-center items-center">
                <input type="file" @change="handleFileSelect" accept="image/*" class="file-input">
            </div>
            <div v-else-if="selectedImage" class="flex">
                <img :src="selectedImage" alt="Selected Image" class="w-2/3 object-cover h-[60vh]" />
                <div class="w-6/12">
                    <button :class="['btn btn-primary']" @click="handleAddPost"> <span :class="[loading && 'loading loading-spinner']"></span>Post</button>
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
import { addDoc, collection } from 'firebase/firestore'
export default {
    name: 'createModal',
    setup() {
        const selectedImage = ref<any>(null)

        const modalStore = useModalStore()
        const loading = ref<boolean>(false)

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
                const postRef = collection(db, `posts/${auth.currentUser?.uid}/userPost`);
                await addDoc(postRef, {
                    userName: 'abc',
                    url,
                    like: [],
                    comment: [],
                    time: Date.now()
                });
                loading.value = false
                modalStore.setOpenCreateModal(false)
            })
        }
        return {
            selectedImage,
            handleFileSelect,
            modalStore,
            handleCloseModal,
            handleAddPost,
            loading
        }
    }
}
</script>

<style></style>