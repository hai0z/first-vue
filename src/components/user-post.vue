<template>
    <div class="flex flex-col mb-6">
        <div class="post-header flex flex-row justify-between mb-2 items-center ">
            <div class="flex flex-row items-center">
                <img src="../assets/img/licha-avatar.jpg" alt="" class="h-10 w-10 rounded-full border border-amber-500">
                <span class="font-semibold text-black text-sm ml-2">lisandromartinezzz <span class="text-gray-400 font-normal">
                        • 4d
                    </span></span>
            </div>
            <i class="fa-solid fa-ellipsis  text-lg cursor-pointer"></i>
        </div>
        <img src="../assets/img/licha.jpg" class="object-cover rounded-sm w-full">
        <div class="post-action flex flex-row items-center py-2">
            <div class="flex gap-4">
                <i class="fa-regular fa-heart text-2xl"></i>
                <i class="fa-regular fa-comment text-2xl"></i>
                <i class="fa-regular fa-paper-plane text-2xl"></i>
            </div>
            <i class="fa-regular fa-bookmark ml-auto text-2xl"></i>
        </div>
        <div class="post-info">
            <span class="font-semibold">3,764,545 likes</span>
            <p class="line-clamp-2"><span class="font-semibold">lisandromartinezzz</span> I love going on holiday in Dubai. Now it’s your turn. Comment
                and tag 4 family
                members or friends you would like to take
                on holiday to Dubai this summe </p>
            <p class=" text-gray-500">View all commment</p>
            <input type="text" placeholder="Add a comment..." class="w-full border-none focus:border-none focus:outline-none">
            <p class="w-full border-b border-gray-300 py-2"></p>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'user-post'
}
</script>