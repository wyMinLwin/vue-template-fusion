<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { transcriptEN, transcriptTH } from './dummyText'
const highlightedTextEN = ref(transcriptEN.Text)
const highlightedTextTH = ref(transcriptTH.Text)

const audioHandler = (e: Event, type: 'en' | 'th') => {
    const currentTime = (e.target as HTMLAudioElement).currentTime
    highlightSegment(currentTime, type)
}

const highlightSegment = (currentTime: number, type: 'en' | 'th') => {
    let highlightedText = ''
    const tolerance = 0.1
    const transcript = type === 'en' ? transcriptEN : transcriptTH
    transcript.textSegment.forEach((word) => {
        if (currentTime >= word.StartTime - tolerance && currentTime <= word.EndTime + tolerance) {
            highlightedText += `<span class="bg-yellow-200">${word.Text}</span>`
        } else {
            highlightedText += `${word.Text}`
        }
    })
    type === 'en'
        ? (highlightedTextEN.value = highlightedText.trim())
        : (highlightedTextTH.value = highlightedText.trim())
}

onBeforeMount(() => {
    let text = transcriptTH.Text
    const segments = transcriptTH.textSegment
    const newSegments = segments.map(segment => {
        let trimmedText = segment.Text.trim()
        if (segment.Text.includes('ยัง')) {
            console.log(segment.Text)
            console.log(text)
        }
        const index = text.indexOf(trimmedText)
        if (index > 0 && text[index - 1] === ' ') {
            trimmedText = ' ' + trimmedText
        }
        if (trimmedText.length > 1 ) {
            text = text.slice(trimmedText.length)
        }        
        return {...segment, Text: trimmedText === '' ? " " : trimmedText}
    })
    transcriptTH.textSegment = newSegments
})
</script>
<template>
    <div class="p-3">
        <h1 class="mb-4 text-xl font-bold">{{ $t('title.text-reader') }}</h1>

        <div class="flex gap-3">
            <section class="h-full p-3 overflow-y-auto bg-white rounded-lg shadow-sm">
                <div>
                    <audio @timeupdate="(e) => audioHandler(e, 'en')" controls preload="auto">
                        <source :src="transcriptEN.Url" type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                    <div v-html="highlightedTextEN"></div>
                </div>

                <div class="mt-3">
                    <audio @timeupdate="(e) => audioHandler(e, 'th')" controls>
                        <source :src="transcriptTH.Url" type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                    <div v-html="highlightedTextTH"></div>
                </div>
            </section>
        </div>
    </div>
</template>
