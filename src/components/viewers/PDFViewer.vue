<script setup lang="ts">
import { CaretLeftIcon, CaretRightIcon } from '@radix-icons/vue'

import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import '@tato30/vue-pdf/style.css'
import ScanOverlay from './ScanOverlay.vue'

const props = defineProps<{
    pdfLink?: string
    class?: string
    isScanning?: boolean
    textLayer: boolean
}>()

const page = ref(1)
const scale = ref(0.75)
const { pdf, pages } = usePDF(props.pdfLink)
</script>

<template>
    <section :class="cn('w-full space-y-3 h-fit', props.class)">
        <div class="pdf-width relative rounded-lg">
            <VuePDF :pdf="pdf" :page="page" :text-layer="props.textLayer" fit-parent :scale="scale">
                <Skeleton class="w-full h-full" />
            </VuePDF>

            <ScanOverlay v-if="props.isScanning" />
        </div>

        <div v-if="pages > 1" class="flex items-center justify-center gap-2">
            <Button
                variant="secondary"
                size="icon"
                class="h-[28px]"
                @click="page = page > 1 ? page - 1 : page"
            >
                <CaretLeftIcon class="w-5 h-5" />
            </Button>
            <span class="text-xs font-medium">{{ page }} / {{ pages }}</span>
            <Button
                variant="secondary"
                size="icon"
                class="h-[28px]"
                @click="page = page < pages ? page + 1 : page"
            >
                <CaretRightIcon class="w-5 h-5" />
            </Button>
        </div>
    </section>
</template>

<style scoped>
.pdf-width {
    width: calc(100% - 0.25rem) !important;
}
</style>
