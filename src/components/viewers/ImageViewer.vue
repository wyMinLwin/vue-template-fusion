<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import ScanOverlay from './ScanOverlay.vue'

const props = defineProps<{
    imageUrl?: string
    rotatePoint: number
    altText: string
    isScanning?: boolean
    class?: string
}>()

const imageContainer = ref<HTMLDivElement | null>(null)

const boxMeasurements = computed(() => {
    const boxRect = imageContainer.value?.getBoundingClientRect()
    return {
        width: boxRect?.width || 0,
        height: boxRect?.height || 0
    }
})

const rotateDegree = computed(() => {
    return props.rotatePoint * 90
})
</script>

<template>
    <div
        ref="imageContainer"
        :class="cn('relative flex items-center justify-center w-full rounded-lg', props.class)"
    >
        <img
            :src="props.imageUrl"
            :alt="props.altText"
            class="transition-transform duration-300 rounded-lg"

            :style="{
                width: props.rotatePoint % 2 === 0 ? boxMeasurements.width + 'px' : 'auto',
                height: props.rotatePoint % 2 !== 0 ? boxMeasurements.width + 'px' : 'auto',
                transform: `rotate(${rotateDegree}deg)`,
                objectFit: 'contain'
            }"
        />

        <ScanOverlay v-if="props.isScanning" class="rounded-lg" />
    </div>
</template>
