<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import { useLoaderStore } from '@/stores/loaderStore'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'

let stream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null

const { loadingOn, loadingOff } = useLoaderStore()
const cameraStatus = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const uploadedType = ref<'img' | 'video'>('img')
const imageBlob = ref<Blob | null>(null)
const videoBlob = ref<Blob | null>(null)
const uploadResponseURL = ref('')
const imageData = ref('')
const facingMode = ref<'user' | 'environment'>('environment')
const isRecording = ref(false)
const recordedChunks: Blob[] = []
const recordedVideoUrl = ref('')

const uploadFileReviewDialog = ref(false)

async function uploadFileToAPI(blob: Blob): Promise<void> {
    uploadedType.value = blob.type.includes('image') ? 'img' : 'video'
    const formData = new FormData()
    formData.append('file', blob)

    try {
        // startLoading();
        loadingOn()
        const response = (await fetch(
            'https://crc-api-test.azurewebsites.net/api/v1/Authentication/UploadFile',
            {
                method: 'POST',
                body: formData
            }
        )) as Response

        if (response !== undefined && response.status !== 200) {
            console.error('Failed to upload file, status code:', response.status)
            // return null;
        }

        const result = await response.json()
        uploadResponseURL.value = result?.file
        uploadFileReviewDialog.value = true
        // return result?.file;
    } catch (error) {
        console.error('Error uploading file:', error)
        // return null;
    } finally {
        // stopLoading();
        loadingOff()
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
        canvasElement.value.toBlob(async (blob) => {
            if (blob) {
                imageBlob.value = blob
            }
        })

        imageData.value = data
    }
}

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
            const blob = new Blob(recordedChunks, { type: 'video/mp4' })
            videoBlob.value = blob
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
                    <Button v-else variant="destructive" @click="stopRecording"
                        >Stop Recording</Button
                    >

                    <Button v-if="!cameraStatus" @click="openCamera">Open Camera</Button>
                    <Button v-else variant="destructive" @click="closeCamera">Close Camera</Button>
                </div>
            </div>

            <div class="flex flex-col items-center gap-3">
                <h2 v-if="imageData">Captured Image</h2>
                <canvas ref="canvasElement"></canvas>

                <div v-if="imageData" class="space-x-4">
                    <a :href="imageData" download="Very Nice Image">
                        <Button> Download Image </Button>
                    </a>
                    <Button @click="uploadFileToAPI(imageBlob!)">Upload Image</Button>
                </div>
            </div>
            <Dialog>
                <DialogTrigger as-child>
                    <Button v-if="recordedVideoUrl">Preview Video</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Recorded Video</DialogTitle>
                    </DialogHeader>
                    <video :src="recordedVideoUrl" controls class="w-full h-auto"></video>
                    <DialogClose @click="uploadFileToAPI(videoBlob!)">Upload</DialogClose>
                    <DialogClose>Close</DialogClose>
                </DialogContent>
            </Dialog>
        </section>
        <Dialog v-model:open="uploadFileReviewDialog">
            <DialogContent>
                <h1 class="text-xl font-bold">Upload File Review</h1>
                <div class="flex justify-end space-x-4">
                    <img
                        v-if="uploadedType === 'img'"
                        :src="uploadResponseURL"
                        alt="Uploaded Image"
                        class="w-full h-auto"
                    />
                    <video
                        v-else
                        :src="uploadResponseURL"
                        controls
                        alt="Uploaded Image"
                        class="w-full h-auto"
                    ></video>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
