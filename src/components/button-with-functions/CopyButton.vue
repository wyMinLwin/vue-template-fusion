<script setup lang="ts">
import { CopyIcon, CheckIcon } from '@radix-icons/vue'
import { Button } from '../ui/button'
import { ref } from 'vue'

const props = defineProps<{
    text: string
}>()

let timeoutCall: NodeJS.Timeout
const timeout = ref(0)
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)

        timeout.value = 2

        clearInterval(timeoutCall)

        timeoutCall = setInterval(() => {
            if (timeout.value > 0) {
                timeout.value -= 1
            } else {
                clearInterval(timeoutCall)
            }
        }, 1000)
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
}
</script>

<template>
    <Button variant="ghost" size="icon" @click="copyToClipboard(props.text)" :disabled="timeout">
        <component
            :is="timeout > 0 ? CheckIcon : CopyIcon"
            :class="timeout > 0 ? 'text-success' : ''"
        ></component>
    </Button>
</template>

<style scoped></style>
