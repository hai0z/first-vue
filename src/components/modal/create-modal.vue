<template>
    <dialog :class="['modal', modalStore.createModalOpen && 'modal-open']">
        <form method="dialog" :class="['modal-box transition-all duration-300 h-4/5', selectedImage && 'w-11/12 max-w-4xl']">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleCloseModal">✕</button>
            <h3 class="font-bold text-lg text-center">Create new post </h3>
            <div className="border-b"></div>
            <div v-if="!selectedImage">
                <input type="file" @change="handleFileSelect" accept="image/*">
                <p>select from computer</p>

            </div>
            <div v-else-if="selectedImage" class="flex">
                <img :src="selectedImage" alt="Selected Image" class="w-1/2 object-cover h-[550px]" />
                <div class="w-6/12">

                </div>
            </div>
        </form>
    </dialog>
</template>

<script lang="ts">
import { useModalStore } from '@/store/useModalStore'
import { ref } from 'vue'
export default {
    name: 'createModal',
    setup() {
        const selectedImage = ref<any>(null)
        const modalStore = useModalStore()
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
        return {
            selectedImage,
            handleFileSelect,
            modalStore,
            handleCloseModal
        }
    }
}
</script>

<style></style>