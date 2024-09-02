<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TodoFormDialog from './chunks/TodoFormDialog.vue'
import { ref } from 'vue'
import { Card } from '@/components/ui/card'

const tabValue = ref('not started')
</script>

<template>
    <section class="p-3 h-full">
        <div class="bg-white p-3 rounded-lg h-full shadow-sm flex flex-col gap-1">
            <div class="grow-0 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <h1 class="text-xl">To Do List!</h1>
                    <TodoFormDialog>
                        <Button>Add New Todo</Button>
                    </TodoFormDialog>
                </div>
                <Tabs
                    :model-value="tabValue"
                    @update:modelValue="(e) => (tabValue = e as string)"
                    default-value="not started"
                >
                    <TabsList class="flex-wrap">
                        <TabsTrigger value="not started"> Not Started </TabsTrigger>
                        <TabsTrigger value="in progress"> In Progress </TabsTrigger>
                        <TabsTrigger value="completed"> Completed </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div class="grow overflow-y-auto">
                <Tabs :model-value="tabValue" default-value="not started" :class="'w-full'">
                    <TabsContent value="not started">
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </section>
</template>
