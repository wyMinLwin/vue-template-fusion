<script lang="ts" setup>
import { Button } from '@/components/ui/button'

import TodoFormDialog from './chunks/TodoFormDialog.vue';
</script>

<template>
    <section>
        <div class="p-3 flex justify-between items-center">
            <h1 class="text-xl">To Do List!</h1>
            <TodoFormDialog>
                <Button>Add New Todo</Button>
            </TodoFormDialog>
        </div>
    </section>
</template>
