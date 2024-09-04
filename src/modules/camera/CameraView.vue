<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Button from '@/components/ui/button/Button.vue'

let stream: MediaStream | null = null
const cameraStatus = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const imageData = ref('')
const facingMode = ref<'user' | 'environment'>('environment')

const openCamera = async () => {
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

            cameraStatus.value = true
        }

        return close
    } catch (err) {
        console.error('Error accessing the camera: ', err)
        close() // Ensures the camera is closed in case of an error
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

        imageData.value = ''
    }
}

const closeCamera = () => {
    if (!stream) return
    stream.getTracks().forEach((track) => track.stop())
    cameraStatus.value = false
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

                <div class="space-x-4">
                    <Button @click="takePhoto">Take Photo</Button>
                    <Button v-if="!cameraStatus" @click="openCamera">Open Camera</Button>
                    <Button v-else variant="destructive" @click="closeCamera">Close Camera</Button>
                </div>
            </div>

            <div class="flex flex-col items-center gap-3">
                <canvas ref="canvasElement"></canvas>

                <div v-if="imageData" class="space-x-4">
                    <a :href="imageData" download="Very Nice Image">
                        <Button> Download Image </Button>
                    </a>

                    <Button variant="destructive" @click="reset"> Reset </Button>
                </div>
            </div>
        </section>
    </div>
</template>
