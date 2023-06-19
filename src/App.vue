<template>
    <div class="bg-base-100 flex flex-row">
        <create-modal />
        <view-post-modal />
        <router-view />
    </div>
</template>
<script lang="ts">
import CreateModal from './components/modal/create-modal.vue';
import ViewPostModal from './components/modal/view-post-modal.vue';

export default {
    name: "App",
    components: { CreateModal, ViewPostModal }
}
</script>
<style></style>