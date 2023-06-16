<template>
    <div class="flex h-screen w-full flex-col bg-slate-600  items-center">
        <h1>Todo App</h1>
        <input type="text" placeholder="enter task name" v-model="taskName" class="text-black max-w-sm p-2 rounded-sm">
        <div class="flex flex-col justify-center w-fit">
            <div v-for="(task, index) in todoList" :key="index" class="bg-indigo-500 my-2 p-2 rounded-md cursor-pointer">
                <p :class="{ 'line-through': task.done }" @click="toggleTask(task.id)"> {{ task.taskName }}</p>
            </div>
            <button @click="addTodo(taskName)">add</button>
        </div>

    </div>
</template>
<script lang="ts">
import { ref, computed } from 'vue';
type todoType = {
    taskName: string,
    id: number,
    done: boolean
}
export default {
    name: 'App',
    setup() {
        const todoList = ref<todoType[]>([])
        const taskName = ref<string>('')
        const addTodo = (taskName1: string) => {
            todoList.value.push({
                id: Math.random() * 1000,
                taskName: taskName1,
                done: true
            })
            taskName.value = ''
        }
        const toggleTask = computed(() => (id: number) => {
            todoList.value = todoList.value.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo);
        });
        return {
            todoList,
            taskName,
            addTodo,
            toggleTask
        }
    }
}
</script>
<style></style>