<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Loader } from '@/components/loaders'
import { RouterView } from 'vue-router'
</script>

<template>
    <Toaster />
    <Loader />
    <RouterView />
</template>
