<script setup lang="ts">
import { useLoaderStore } from '@/stores/loaderStore'
import { useIsFetching } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'

const isFetching = useIsFetching()
const loaderStore = useLoaderStore()
const { isLoading } = storeToRefs(loaderStore)
</script>

<template>
    <section
        v-if="isLoading || isFetching"
        class="bg-black/75 fixed top-0 z-[999] flex items-center justify-center w-screen h-screen overflow-hidden"
    >
        <div class="loader"></div>
    </section>
</template>

<style scoped>
.loader {
    width: 55px;
    aspect-ratio: 1;
    --g1: conic-gradient(from 90deg at 3px 3px, #0000 90deg, #fff 0);
    --g2: conic-gradient(from -90deg at 22px 22px, #0000 90deg, #fff 0);
    background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
    background-size: 25px 25px;
    background-repeat: no-repeat;
    animation: l7 1.5s infinite;
}

@keyframes l7 {
    0% {
        background-position:
            0 0,
            0 100%,
            100% 100%;
    }
    25% {
        background-position:
            100% 0,
            0 100%,
            100% 100%;
    }
    50% {
        background-position:
            100% 0,
            0 0,
            100% 100%;
    }
    75% {
        background-position:
            100% 0,
            0 0,
            0 100%;
    }
    100% {
        background-position:
            100% 100%,
            0 0,
            0 100%;
    }
}
</style>
