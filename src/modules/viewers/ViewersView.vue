<script setup lang="ts">
import { ImageViewer, PDFViewer } from '@/components/viewers'
import {
    EnterFullScreenIcon,
    FileIcon,
    FileTextIcon,
    OpenInNewWindowIcon,
    ResetIcon
} from '@radix-icons/vue'
import { reactive, ref } from 'vue'

const links = {
    image: 'https://images.alphacoders.com/134/1342145.jpeg',
    pdf: 'https://crchrstoragedev.blob.core.windows.net/uploadedimages/Lotus.pdf',
    word: 'https://crchrstoragedev.blob.core.windows.net/uploadeddocument/inbound4042115537094484177_12046978-cc58-4adf-ada2-7d14e64e181a.docx'
}

const rotatePoints = reactive({
    image: 0
})

const pdfTextLayer = ref(false)

const scans = reactive({
    image: false,
    pdf: false
})

const rotate = (type: keyof typeof rotatePoints, direction: 'left' | 'right') => {
    rotatePoints[type] = rotatePoints[type] + (direction === 'left' ? -1 : 1)
}

const openScan = (type: keyof typeof scans) => {
    scans[type] = true

    setTimeout(() => {
        scans[type] = false
    }, 4000)
}
</script>

<template>
    <div class="p-3 space-y-3">
        <h1 class="text-xl font-bold">Viewers!</h1>

        <section class="grid grid-cols-3 gap-4">
            <div class="col-span-2 space-y-3">
                <div class="bg-primary/75 h-fit text-[#4a411e] p-4 pt-2 rounded-lg shadow-xl">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold">Image Viewer</h4>

                        <div class="flex gap-2 p-1 bg-white rounded-lg">
                            <div
                                class="hover:bg-accent text-primary min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                                @click="openScan('image')"
                            >
                                <EnterFullScreenIcon class="w-4 h-4" />
                                <span class="text-xs text-[#4a411e]">Scan</span>
                            </div>

                            <div
                                class="hover:bg-accent text-primary min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                                @click="rotate('image', 'left')"
                            >
                                <ResetIcon class="w-4 h-4" />
                                <span class="text-xs text-[#4a411e]">Left</span>
                            </div>

                            <div
                                class="hover:bg-accent text-primary min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                                @click="rotate('image', 'right')"
                            >
                                <ResetIcon class="w-4 h-4 -rotate-180" />
                                <span class="text-xs text-[#4a411e]">Right</span>
                            </div>
                        </div>
                    </div>

                    <ImageViewer
                        :image-url="links.image"
                        alt-text="Image"
                        :rotatePoint="rotatePoints.image"
                        :isScanning="scans.image"
                        :class="rotatePoints.image % 2 !== 0 ? 'shadow-none' : 'shadow'"
                    />
                </div>

                <div class="bg-[#b8cedc] h-fit text-[#184363] p-4 pt-2 rounded-lg shadow-xl">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold">Word File</h4>

                        <a
                            :href="links.word"
                            target="_blank"
                            class="hover:bg-accent text-[#b8cedc] min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded shadow cursor-pointer"
                        >
                            <OpenInNewWindowIcon class="w-4 h-4" />
                            <span class="text-xs text-[#184363]">View</span>
                        </a>
                    </div>

                    <p class="text-sm font-medium">Don't have a UI for Word file now.</p>
                </div>
            </div>

            <div
                class="bg-success/75 text-[#1c471f] h-fit col-span-1 p-4 pt-2 rounded-lg shadow-xl"
            >
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold">PDF Viewer</h4>

                    <div class="flex gap-2 p-1 bg-white rounded-lg">
                        <div
                            class="hover:bg-accent text-success/75 min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                            @click="openScan('pdf')"
                        >
                            <EnterFullScreenIcon class="w-4 h-4" />
                            <span class="text-xs text-[#1c471f]">Scan</span>
                        </div>

                        <div
                            class="hover:bg-accent text-success/75 min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                            @click="pdfTextLayer = !pdfTextLayer"
                        >
                            <component
                                :is="pdfTextLayer ? FileTextIcon : FileIcon"
                                class="w-4 h-4"
                            ></component>
                            <span class="text-xs text-[#1c471f]">Text Layer</span>
                        </div>

                        <a
                            :href="links.pdf"
                            target="_blank"
                            class="hover:bg-accent text-success/75 min-w-[50px] flex flex-col items-center gap-1 p-1 bg-white rounded cursor-pointer"
                        >
                            <OpenInNewWindowIcon class="w-4 h-4" />
                            <span class="text-xs text-[#184363]">View</span>
                        </a>
                    </div>
                </div>

                <PDFViewer
                    :pdf-link="links.pdf"
                    :isScanning="scans.pdf"
                    :text-layer="pdfTextLayer"
                />
            </div>
        </section>
    </div>
</template>
