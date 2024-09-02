<script setup lang="ts"></script>

<template>
    <div class="loader"></div>
</template>

<style scoped>
.loader {
    height: 2px;
    width: 100%;
    --c: no-repeat linear-gradient(hsl(var(--primary)) 0 0);
    background: var(--c), var(--c), hsl(var(--accent));
    background-size: 60% 100%;
    animation: l16 4s infinite;
}

@keyframes l16 {
    0% {
        background-position:
            -150% 0,
            -150% 0;
    }
    66% {
        background-position:
            250% 0,
            -150% 0;
    }
    100% {
        background-position:
            250% 0,
            250% 0;
    }
}
</style>
