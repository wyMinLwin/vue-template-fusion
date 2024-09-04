<script setup lang="ts">
/**
 * Need relative in parent container
 * use absolute position
 */

import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: string
}>()
</script>

<template>
    <div class="scanner-container">
        <div :class="cn('scanner-line bg-black/50', props.class)"></div>
        <span class="scanning-text">Scanning</span>
    </div>
</template>

<style scoped>
.scanner-container {
    --position-space: 8px;
    --space-between: 16px;
    --corner-size: 40px; /* Size of the corner outline */
    --border-thickness: 2px; /* Thickness of the border */
    --border-gap: 0px; /* Gap between border and image */
    --border-radius: 8px; /* Rounded corner radius */

    position: absolute;
    top: calc(-1 * var(--position-space));
    left: calc(-1 * var(--position-space));
    width: calc(100% + var(--space-between));
    height: calc(100% + var(--space-between));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(var(--border-gap) + var(--border-thickness));
    outline: var(--border-thickness) solid #555555;
    outline-offset: calc(-1 * var(--border-thickness));
    border-radius: var(--border-radius);
    mask:
        conic-gradient(at var(--corner-size) var(--corner-size), transparent 75%, #000 0) 0 0 /
            calc(100% - var(--corner-size)) calc(100% - var(--corner-size)),
        linear-gradient(#000 0 0) content-box;
}

.scanner-line {
    width: calc(100% - var(--space-between));
    height: calc(100% - var(--space-between));
    position: absolute;
    top: var(--position-space);
    left: var(--position-space);
    /* background-color: rgba(0, 0, 0, 0.2); */
    border-bottom: 1px solid #ffffff;
    animation: scale-up-ver-top 5s cubic-bezier(0.39, 0.575, 0.565, 1) infinite;
}

.scanning-text {
    animation: pulse 2s infinite;
    font-weight: bold;
    color: white;
    user-select: none;
}

@keyframes scale-up-ver-top {
    0% {
        transform: scaleY(0);
        transform-origin: 100% 0%;
    }
    100% {
        transform: scaleY(1);
        transform-origin: 100% 0%;
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
</style>
