<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'

let stream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
const cameraStatus = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const imageData = ref('')
const facingMode = ref<'user' | 'environment'>('environment')
const isRecording = ref(false)
const recordedChunks: Blob[] = []
const recordedVideoUrl = ref('')

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

const closeCamera = () => {
    if (!stream) return
    stream.getTracks().forEach((track) => track.stop())
    cameraStatus.value = false
}

const startRecording = () => {
    if (stream) {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data)
            }
        }
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' })
            recordedVideoUrl.value = URL.createObjectURL(blob)
            recordedChunks.length = 0
        }
        mediaRecorder.start()
        isRecording.value = true
    }
}

const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
        isRecording.value = false
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

                <div class="space-x-4">
                    <Button @click="takePhoto">Take Photo</Button>
                    <Button v-if="!isRecording" @click="startRecording">Record Video</Button>
                    <Button v-else variant="destructive" @click="stopRecording">Stop Recording</Button>

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
                </div>
            </div>
        </section>

        <Dialog>
            <DialogTrigger as-child>
                <Button v-if="recordedVideoUrl">Preview Video</Button>
            </DialogTrigger>
            <DialogContent>
                <video :src="recordedVideoUrl" controls class="w-full h-auto"></video>
                <DialogClose>Close</DialogClose>
            </DialogContent>
        </Dialog>
    </div>
</template>