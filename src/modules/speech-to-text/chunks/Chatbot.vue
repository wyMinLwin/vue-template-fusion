<script setup lang="ts">
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk' // Import Microsoft Speech SDK
import { nextTick, onMounted, reactive, ref, watch, watchEffect } from 'vue'

import axios from 'axios'
import { removeMarkdown, ssmlWriter } from '@/lib/utils'
import AudioAndContent from './AudioAndContent.vue'
import { fetchHistoryByID } from '@/api/text-to-speech/queries'
import type { TextToSpeechType } from '@/api/text-to-speech-v/types'

const props = defineProps<{
    id: string
    firstTimeToCallGPT: boolean
    previousRequestText: string
}>()
const emits = defineEmits([
    'closeFirstTimeToCallGPT',
    'setPreviousRequestText',
    'update:parentData'
])
const { data, refetch } = fetchHistoryByID.useQuery(props.id)

const isRecording = ref(false)
const isProcessing = ref(false)

const recognizer = ref<SpeechSDK.SpeechRecognizer | null>(null)

const settings = reactive({
    model: '352',
    language: 'en-US'
})

const transcript = ref('')
const title = ref('')
const isResponding = ref(false)
const audioURL = ref<string | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)

const chatLists = ref<
    Array<{
        question: string
        answer: string
    }>
>([])

const audioDuration = ref(0)
const chatContainer = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

const onLoadedMetadata = (e: Event) => {
    audioDuration.value = (e.target as HTMLAudioElement).duration
}

const onAudioPlay = async () => {
    const text = chatLists.value[chatLists.value.length - 1].answer
    typewriterText.value = ''
    await nextTick()
    typewriterEffect(text, audioDuration.value)
}

const onAudioEnded = () => {
    isResponding.value = false
    // Handle audio end if needed
}

const typewriterText = ref('')
const typewriterEffect = (text: string, duration: number) => {
    isProcessing.value = false
    const totalCharacters = text.length
    const interval = Math.max((duration / totalCharacters) * 1000, 50) // Ensure a minimum interval of 50ms
    let currentIndex = 0
    console.log('Starting typewriter effect. Interval:', interval)
    const intervalId = setInterval(async () => {
        if (currentIndex < totalCharacters) {
            typewriterText.value += text[currentIndex]
            currentIndex++
            await nextTick()
        } else {
            clearInterval(intervalId)
        }
    }, interval)
}

watch(typewriterText, () => {
    // console.log('scrollEffect', chatContainer.value?.clientHeight)
    if (chatContainer.value && container.value) {
        container.value.scrollTop = container.value.scrollHeight
    }
})

const initializeRecognizer = () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        '6654d23c64f6449faf74a7a07740fd95',
        'southeastasia'
    )
    try {
        speechConfig.speechRecognitionLanguage = settings.language
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
        recognizer.value = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

        recognizer.value.recognizing = (_s, e) => {
            console.log(e.result.text)
        }

        recognizer.value.recognized = (_s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                // updateTranscript(e.result.text)
                transcript.value += ` ${e.result.text}`
                // Clear flag when recognition is complete
            }
        }
    } catch {
        console.error('Error initializing Speech SDK')
    }
}

async function getFromGPT(userMessage: string): Promise<void> {
    // if (isResponseStopped.value) return
    audioDuration.value = 0
    typewriterText.value = ''
    isResponding.value = true
    isProcessing.value = true
    if (!props.firstTimeToCallGPT) {
        title.value = transcript.value
        chatLists.value.push({
            question: transcript.value,
            answer: ''
        })
    }
    transcript.value = ''
    let web_url = 'https://portal.askmeplease.ai' // prod url
    // AI_Condition.value = 'think'
    // isThinking.value = true // Set isThinking to true when starting the thinking process
    try {
        const statusText = ['|Text|*Streaming:true*|', '|Text|*Streaming:false*|', 'data: [DONE]']
        // audioFullyEnded.value = false
        // textFullyEnded.value = false
        // outputText.isTyping = true
        // ai.textApiCallFinished = false

        // Select the appropriate GUID based on settings.model
        // let selectedGuid
        // switch (settings.model) {
        //     case 194:
        //         selectedGuid = guidTR.value
        //         break
        //     case 195:
        //         selectedGuid = guidHR.value
        //         break
        //     case 196:
        //         selectedGuid = guidRR.value
        //         break
        //     default:
        //         selectedGuid = 'cd57f972-e838-4fc4-8c2f-ca4940716ef0' // Fallback GUID
        //         break
        // }

        let dataPost = {
            events: [
                {
                    replyToken: 'dummyToken',
                    type: 'message',
                    timestamp: 1462629479859,
                    source: {
                        type: 'users',
                        userId: 'cd57f972-e838-4fc4-8c2f-ca4940716ef0'
                    },
                    message: {
                        type: 'text',
                        IsStream: false,
                        modelDisplay: 352,
                        text: userMessage
                    }
                }
            ]
        }

        const controller = new AbortController()
        let config = {
            signal: controller.signal,
            maxRedirects: 0
        }

        const res = await axios.post(
            `${web_url}/api/v0/GPTStream/GptFullSpeechPOST`,
            dataPost,
            config
        )

        let _responseText = res.data
        const markdownImageRegex = /!\[.*?\]\((.*?)\)/g

        const matches = [..._responseText.matchAll(markdownImageRegex)]
        // markdownImages.value = matches.map((match) => match[1])
        _responseText = _responseText.replaceAll(markdownImageRegex, '')

        const markdownTablesRegex = /^\|.*\|\n\|\s*[:-]+[\s\S]*\|.*\|$/gm

        const tableMatches = [..._responseText.matchAll(markdownTablesRegex)]
        for (const match of tableMatches) {
            const tableText = match[0]
            const rows = tableText
                .trim()
                .split('\n')
                .map((row: string) =>
                    row
                        .split('|')
                        .filter((cell) => cell.trim() !== '')
                        .map((cell) => cell.trim())
                        .filter((cell) => cell !== '-'.repeat(cell.length))
                )
            // markdownTables.value.push(rows.filter((row: Array<string>) => row.length > 0))
        }
        _responseText = _responseText.replaceAll(markdownTablesRegex, '')

        for (const text of statusText) {
            _responseText = _responseText.replaceAll(text, '')
        }
        console.log(props.firstTimeToCallGPT)
        if (!props.firstTimeToCallGPT) {
            audioURL.value = await getAudioFileData(_responseText)

            chatLists.value[chatLists.value.length - 1].answer = _responseText

            audioRef.value?.load()
            await nextTick()
            audioRef.value?.play().catch((error) => {
                console.error(error)
            })
        }
    } catch (error) {
        console.error(error)
    } finally {
        emits('closeFirstTimeToCallGPT')

        // ai.textApiCallFinished = true
    }
}

async function getAudioFileData(message: string): Promise<string | null> {
    const web_url = 'https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1'

    try {
        const sanitizedText = message.replace(/\s+/g, ' ').trim()
        const ssml = ssmlWriter(
            settings.language,
            Number(settings.model),
            removeMarkdown(sanitizedText)
        )
        const response = await axios.post(web_url, ssml, {
            headers: {
                'Ocp-Apim-Subscription-Key': '6654d23c64f6449faf74a7a07740fd95',
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
            },
            responseType: 'arraybuffer'
        })

        const audioBlob = new Blob([response.data], {
            type: 'audio/mp3'
        })
        const audioUrl = URL.createObjectURL(audioBlob)
        return audioUrl
    } catch (error) {
        console.error(error)
    } finally {
    }
    return null
}



const splitTextIntoSegments = (text: string, duration: number) => {
    const words = text.split(' ')
    const segmentDuration = duration / words.length
    return words.map((word, index) => ({
        text: word,
        startTime: index * segmentDuration,
        endTime: (index + 1) * segmentDuration
    }))
}

onMounted(() => {
    initializeRecognizer()
})

watchEffect(async () => {
    if (
        data.value?.text &&
        data.value.text !== props.previousRequestText &&
        props.firstTimeToCallGPT
    ) {
        await getFromGPT(data.value.text)
        emits('setPreviousRequestText', data.value.text)
        isResponding.value = false
        isProcessing.value = false
    }
})

watch(
    () => data.value,
    (newVal) => {
        if (newVal) emits('update:parentData', newVal)
    }
)

defineExpose({
    refetch
})
</script>

<template>
    <div class="rounded-[6px] space-y-2 text-white bg-black">
        <AudioAndContent
            :id="props.id"
            :is-responding="isResponding"
            :data="data as TextToSpeechType"
        />

        <iframe
            :src="`https://vsf-thai-pbs-dev.nuttakrit.com/?id=${props.id}`"
            title="Fusion Chat Bot"
            allowfullscreen
            allow="microphone"
            class="w-full h-screen rounded-[6px]"
        ></iframe>
    </div>

    <audio
        ref="audioRef"
        @play="onAudioPlay"
        @ended="onAudioEnded"
        @loadedmetadata="onLoadedMetadata"
        v-if="audioURL"
        :src="audioURL"
        controls
        class="hidden"
    ></audio>
</template>
