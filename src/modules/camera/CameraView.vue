<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { onMounted, ref } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const imageData = ref('')
const facingMode = ref<'user' | 'environment'>('environment')

const openCamera = async () => {
    let stream = null

    try {
        const constraints = {
            video: {
                facingMode: facingMode.value,
                aspectRatio: { ideal: 1 }
            }
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoElement.value) {
            videoElement.value.srcObject = stream

            videoElement.value.onloadedmetadata = () => {
                videoElement.value?.play()
            }
        }
    } catch (err) {
        console.error('Error accessing the camera: ', err)
    }
}

const takePhoto = () => {
    const context = canvasElement.value?.getContext('2d')

    if (canvasElement.value && videoElement.value) {
        canvasElement.value.width = videoElement.value?.videoWidth || 0
        canvasElement.value.height = videoElement.value?.videoHeight || 0

        context?.drawImage(
            videoElement.value,
            0,
            0,
            canvasElement.value.width,
            canvasElement.value.height
        )

        const data = canvasElement.value.toDataURL('image/png')
        imageData.value = data
    }
}

const reset = () => {
    const context = canvasElement.value?.getContext('2d')

    if (!context) return

    if (canvasElement.value && videoElement.value) {
        context.fillStyle = '#FFF'
        context.fillRect(0, 0, videoElement.value?.videoWidth, videoElement.value?.videoHeight)

        const data = canvasElement.value.toDataURL('image/png')
        imageData.value = ''
    }
}

onMounted(() => {
    openCamera()
})
</script>

<template>
    <div class="p-3 space-y-3">
        <h1 class="text-xl font-bold">Camera!</h1>

        <section class="grid grid-cols-2 gap-4 py-4 bg-white">
            <div class="flex flex-col items-center gap-3">
                <video ref="videoElement" src="" class="rounded"></video>
                <Button @click="takePhoto">Take Photo</Button>
            </div>

            <div class="flex flex-col items-center gap-3">
                <canvas ref="canvasElement"></canvas>

                <div v-if="imageData" class="space-x-4">
                    <a  :href="imageData" download="Very Nice Image">
                        <Button> Download Image </Button>
                    </a>

                    <Button variant="destructive" @click="reset"> Reset </Button>
                </div>
            </div>
        </section>
    </div>
</template>
