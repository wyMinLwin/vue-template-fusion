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

const props = defineProps<{
    id: string
}>()

const { data, isLoading } = fetchHistoryByID.useQuery(props.id)

const forceRender = ref(0)
const highlightedText = ref(data.value?.text)
const audioSource = ref(data.value?.url)
const segmentList = ref(data.value?.segmentList)

const audioHandler = (e: Event) => {
    if (data.value?.aliasList.length) return
    const currentTime = (e.target as HTMLAudioElement).currentTime
    highlightSegment(currentTime)
}

const highlightSegment = (currentTime: number) => {
    let res = ''
    const tolerance = 0.1
    segmentList.value?.forEach((word) => {
        if (currentTime >= word.startTime - tolerance && currentTime <= word.endTime + tolerance) {
            res += `<span class="bg-yellow-200">${word.text}</span>`
        } else {
            res += `${word.text}`
        }
    })
    highlightedText.value = res.trim()
}

watch(
    () => data.value?.text,
    () => {
        highlightedText.value = data.value?.text
    }
)

watch(
    () => data.value?.segmentList,
    () => {
        // segmentList.value = data.value?.segmentList
        if (!data.value) return

        let text = data.value?.text
        const segments = data.value?.segmentList
        const newSegments = segments?.map((segment) => {
            let trimmedText = segment.text.trim()
            const index = text.indexOf(trimmedText)
            if (index > 0 && (text[index - 1] === ' ' || text[index - 1] === '\n')) {
                trimmedText = ' ' + trimmedText
            }
            if (trimmedText.length > 1) {
                text = text.slice(trimmedText.length)
            }
            return { ...segment, text: trimmedText === '' ? ' ' : trimmedText }
        })
        segmentList.value = newSegments
    }
)

watch(
    () => data.value?.url,
    () => {
        forceRender.value++
        audioSource.value = data.value?.url
    }
)
</script>

<template>
    <section class="w-full p-3">
        <div v-if="!isLoading">
            <audio :key="forceRender" @timeupdate="(e) => audioHandler(e)" controls>
                <source :src="audioSource" type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
            <div class="mt-2" v-html="highlightedText"></div>
        </div>
        <div v-if="data?.aliasList.length" class="mt-5">
            <h2 class="text-center text-lg font-semibold mb-1">Alias Words</h2>
            <Table class="bg-white shadow-sm border-collapse rounded-xl table-auto">
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
        </div>

        <!-- <div class="mt-3">
                    <audio @timeupdate="(e) => audioHandler(e, 'th')" controls>
                        <source :src="transcriptTH.Url" type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                    <div v-html="highlightedTextTH"></div>
                </div> -->
    </section>
</template>
