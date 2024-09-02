<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TodoFormDialog from './chunks/TodoFormDialog.vue'
import { computed, ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { fetchTodos } from '@/api/todo-list/quries'
import type { TodoType } from '@/api/todo-list/types'

const tabValue = ref('Not Started')
const statusOptions = ['Not Started', 'In Progress', 'Completed']

const { data } = fetchTodos.useQuery()

const todos = computed(() => {
    const todos: Array<Array<TodoType>> = [[], [], []]
    data.value?.forEach((todo) => {
        switch (todo.status) {
            case 'Not Started':
                todos[0].push(todo)
                break
            case 'In Progress':
                todos[1].push(todo)
                break
            case 'Completed':
                todos[2].push(todo)
                break
        }
    })
    // todos[2] = [...todos[2],...todos[2],...todos[2],...todos[2],...todos[2],...todos[2],...todos[2]]
    return todos
})
</script>

<template>
    <section class="p-3 h-full">
        <div class="bg-white p-3 rounded-lg h-full shadow-sm flex flex-col gap-1">
            <div class="grow-0 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <h1 class="text-xl">To Do List!</h1>
                    <TodoFormDialog :type="'add'">
                        <Button>Add New Todo</Button>
                    </TodoFormDialog>
                </div>
                <Tabs
                    :model-value="tabValue"
                    @update:modelValue="(e) => (tabValue = e as string)"
                    default-value="Not Started"
                >
                    <TabsList class="flex-wrap">
                        <TabsTrigger value="Not Started"> Not Started </TabsTrigger>
                        <TabsTrigger value="In Progress"> In Progress </TabsTrigger>
                        <TabsTrigger value="Completed"> Completed </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div class="grow overflow-y-auto">
                <Tabs :model-value="tabValue" default-value="Not Started" :class="'w-full'">
                    <!-- <TabsContent value="Not Started">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  w-full gap-2">
                            <Card class="w-full p-2 shadow-[#00000011]">
                                <div>My tasks</div>
                            </Card>
                            <Card class="w-full p-2 shadow-[#00000011]">
                                <div>My tasks</div>
                            </Card>
                            <Card class="w-full p-2 shadow-[#00000011]">
                                <div>My tasks</div>
                            </Card>
                            <Card class="w-full p-2 shadow-[#00000011]">
                                <div>My tasks</div>
                            </Card>
                        </div>
                    </TabsContent> -->
                    <TabsContent v-for="statusO in statusOptions" :key="statusO" :value="statusO">
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full gap-2"
                        >
                            <Card
                                v-for="todo in todos[statusOptions.indexOf(statusO)]"
                                :key="todo.id"
                                class="w-full p-2 shadow-[#00000011] h-fit"
                            >
                                <div class="w-full text-nowrap text-ellipsis overflow-hidden">
                                    {{ todo.title }}
                                </div>
                                <div class="">
                                    {{ todo.description }} 
                                </div>
                                <div class="flex flex-col gap-1 mt-2">
                                    <Button :disabled="todo.status === 'Completed'" variant="outline"> Edit </Button>
                                    <Button :disabled="todo.status === 'Completed'"> Complete </Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </section>
</template>
