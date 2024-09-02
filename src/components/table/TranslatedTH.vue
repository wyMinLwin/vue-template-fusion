<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
    text: string
    class?: string
}>()
</script>

<template>
    <div :class="cn('whitespace-nowrap', props.class)">
        {{ $t(props.text) }}
    </div>
</template>
