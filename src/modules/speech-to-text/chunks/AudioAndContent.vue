<script setup lang="ts">
import { fetchHistoryByID } from '@/api/text-to-speech/queries'
import { ref, watch } from 'vue'
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
    TableEmpty,
    TableRow
} from '@/components/ui/table'
import type { TextToSpeechType } from '@/api/text-to-speech-v/types';

const props = defineProps<{
    id: string
    data: TextToSpeechType
    isResponding: boolean
}>()


const forceRender = ref(0)
const highlightedText = ref(props.data?.text)
const audioSource = ref(props.data?.url)
const segmentList = ref(props.data?.segmentList)

const audioHandler = (e: Event) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime
    highlightSegment(currentTime)
}

const highlightSegment = (currentTime: number) => {
    let res = ''
    const tolerance = 0.1
    segmentList.value?.forEach((word) => {
        if (currentTime >= word.startTime - tolerance && currentTime <= word.endTime + tolerance) {
            res += `<span class="text-yellow-400">${word.text}</span>`
        } else {
            res += `${word.text}`
        }
    })
    highlightedText.value = res.trim()
}

watch(
    () => props.data?.text,
    () => {
        highlightedText.value = props.data?.text
    }
)

watch(
    () => props.data?.segmentList,
    () => {
        // segmentList.value = props.data?.segmentList
        if (!props.data) return

        let text = props.data?.text
        const segments = props.data?.segmentList
        const newSegments = segments?.map((segment) => {
            let trimmedText = segment.text.trim()
            const index = text.indexOf(trimmedText)
            if (trimmedText === 'a') {
                console.log(text)
                
            }
            if (index > 0 && (text[index - 1] === ' ' || text[index - 1] === '\n')) {
                trimmedText = ' ' + trimmedText
            }
            if (trimmedText.length > 1) {
                text = text.slice( index + trimmedText.length - 1 )
            }
            return { ...segment, text: trimmedText === '' ? ' ' : trimmedText }
        })
        segmentList.value = newSegments
    }
)

watch(
    () => props.data?.url,
    () => {
        forceRender.value++
        audioSource.value = props.data?.url
    }
)
</script>

<template>
    <section class="w-full p-3">
        <div>
            <audio :class="props.isResponding && 'pointer-events-none'" :key="forceRender" @timeupdate="(e) => audioHandler(e)" controls>
                <source :src="audioSource" type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
            <div class="mt-2" v-html="highlightedText"></div>
        </div>
        <!-- <div v-if="data?.aliasList.length" class="mt-5">
            <h2 class="mb-1 text-lg font-semibold text-center">Alias Words</h2>
            <Table class="rounded-xl bg-white border-collapse shadow-sm table-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-1/2 text-center border-[1px]">Text</TableHead>
                        <TableHead class="w-1/2 text-center border-[1px]">Speech</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(alias, aliasIndex) in data?.aliasList" :key="aliasIndex">
                        <TableCell class="w-1/2 text-center border-[1px]">{{
                            alias.textToMap
                        }}</TableCell>
                        <TableCell class="w-1/2 text-center border-[1px]">{{
                            alias.alias
                        }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div> -->

        <!-- <div class="mt-3">
                    <audio @timeupdate="(e) => audioHandler(e, 'th')" controls>
                        <source :src="transcriptTH.Url" type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                    <div v-html="highlightedTextTH"></div>
                </div> -->
    </section>
</template>
