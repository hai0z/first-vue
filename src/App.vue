<template>
    <h1>Todo App</h1>
    <input type="text" placeholder="enter task name" v-model="taskName" class="text-black">
   
   <div class="flex flex-col justify-center w-fit">
    <div v-for="(task,index) in todoList" :key="index" class="bg-indigo-500 my-2 p-2 rounded-md cursor-pointer">
        {{task.taskName }}
    </div>
    <button class="" @click="addTodo(taskName)">add</button>
   </div>
   
</template>
<script lang="ts">
  export default{
    name:'App',
    data(){
         return{
            todoList:[{
                id:1,
                taskName:'mua do choi'
            }] as Array<{id:number,taskName:string}>,
            taskName:''
         }
    },
   methods:{
    addTodo(taskName: string){
        this.todoList.push({id:Math.random()*1000, taskName:taskName})
        this.taskName=""
    }
   }
  }
</script>
<style>
</style>