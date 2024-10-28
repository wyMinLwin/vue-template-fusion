<script setup lang="ts">
import { Label } from '@/components/ui/label'
import type { EXAMPLE_RESPONSE_DATA } from '../data'

const props = defineProps<{
    responseData: typeof EXAMPLE_RESPONSE_DATA
}>()
</script>

<template>
    <div>
        <p class="text-sm">Object Root</p>

        <div class="data-type">Example: API Response</div>

        <div class="hover:bg-accent grid grid-cols-5 gap-2 p-3 border-b">
            <Label>Key</Label>
            <Label>Description</Label>
            <Label>Type</Label>
            <Label class="col-span-2">Example</Label>
        </div>
        <div class="hover:bg-accent grid grid-cols-5 gap-2 p-3 text-sm border-b">
            <span>-</span>
            <span>message</span>
            <span>string</span>
            <span class="col-span-2">Successfully!</span>
        </div>
        <div class="hover:bg-accent grid grid-cols-5 gap-2 p-3 text-sm border-b">
            <span>-</span>
            <span>status</span>
            <span>int</span>
            <span class="col-span-2">0</span>
        </div>
        <div class="hover:bg-accent grid grid-cols-5 gap-2 p-3 text-sm border-b">
            <span>-</span>
            <span>data</span>
            <span>object</span>
            <span class="col-span-2 break-all">{{ props.responseData }}</span>
        </div>
    </div>
</template>

<style scoped>
.data-type {
    @apply bg-gray-200 w-fit text-xs px-px;

    margin-block: 4px !important;
}
</style>
