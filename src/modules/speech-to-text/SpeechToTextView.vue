<script setup lang="ts">
import { CheckIcon } from '@radix-icons/vue'

import type { AddSToTVPayload, TextToSpeechType } from '@/api/text-to-speech-v/types'
import type { LanguageType } from '@/shared/global'
import { LANGUAGES } from '@/shared/constants'

import { computed, reactive, ref, watch } from 'vue'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { useLoaderStore } from '@/stores/loaderStore'
import { audioBufferToWav } from '@/lib/videoToWav'
import { addSpeechToTextVMutation } from '@/api/text-to-speech-v/queries'

import { toast } from '@/components/ui/toast'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AutoForm } from '@/components/ui/auto-form'
import AutoFormField from '@/components/ui/auto-form/AutoFormField.vue'
import { useRouter } from 'vue-router'
import Chatbot from './chunks/Chatbot.vue'

const router = useRouter()
const { t } = useI18n()
const { loadingOn, loadingOff } = useLoaderStore()
const speechToTextID = ref('')
const forceRender = ref(0)

const schema = z.object({
    title: z
        .string({
            required_error: t('error-msg.required')
        })
        .min(2, {
            message: t('error-msg.min-2-characters')
        }),

    mp4File: z.string({
        required_error: t('error-msg.required')
    }),
    wavFile: z.string({
        required_error: t('error-msg.required')
    })
})

const form = useForm({
    validationSchema: toTypedSchema(schema)
})

// have unused variables -> kindly remove it xD
const data = reactive({
    mp4File: null as null | File,
    wavFile: null as null | File,
    mp4Blob: new Blob(),
    wavBlob: new Blob(),
    wavLink: ''
})

const settings = reactive({
    language: 'en-US' as LanguageType
})

function extractAudioAndChangeToWav() {
    if (!data.mp4File) {
        console.error('No mp4File found in data')
        return
    }

    const audioContext = new window.AudioContext()
    const reader = new FileReader()

    reader.onload = function () {
        const arrayBuffer = reader.result as ArrayBuffer

        audioContext.decodeAudioData(
            arrayBuffer,
            function (buffer) {
                console.log('Audio data decoded successfully')
                const wavBlob = audioBufferToWav(buffer, true)
                const wavName =
                    data.mp4File?.name.toLowerCase().replace('.mp4', '.wav').replace('.m4a', '.wav') ??
                    'output.wav'

                data.wavBlob = wavBlob
                data.wavFile = new File([data.wavBlob], wavName, {type: 'audio/wav'})
                data.wavLink = URL.createObjectURL(data.wavBlob)
                form.setFieldValue('wavFile', wavName)
                console.log('WAV file created:', wavName)
            },
            function (error) {
                console.error('Error decoding audio: ', error)
            }
        )
    }

    reader.readAsArrayBuffer(data.mp4File)
}

const handleChange = async (e: Event) => {
    const input = e.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
        const file = input.files[0]

        const arrayBuffer = await file.arrayBuffer()
        const mp4Blob = new Blob([arrayBuffer], { type: file.type })

        data.mp4Blob = mp4Blob
        form.setFieldValue('mp4File', URL.createObjectURL(data.mp4Blob))

        data.mp4File = file
    }
}

const resetMp4 = () => {
    data.mp4Blob = new Blob()
    data.wavBlob = new Blob()
    data.mp4File = null
    data.wavFile = null
    data.wavLink = ''

    form.setFieldValue('mp4File', '')
    form.setFieldValue('wavFile', '')
}

const { mutate: addSpeechToText } = addSpeechToTextVMutation.useMutation({
    onMutate: loadingOn,
    onSuccess: (data) => {
        speechToTextID.value = data.data
        forceRender.value++
        form.resetForm()
    },
    onError: (error) => {
        console.error('Error:', error)

        toast({
            title: t('error-msg.error'),
            description: t('error-msg.error'),
            variant: 'destructive'
        })
    },
    onSettled: loadingOff
})

function onSubmit() {
    const payload: AddSToTVPayload = {
        file: data.wavFile!,
        title: form.values?.title ?? '',
        languagedata: settings.language
    }

    addSpeechToText(payload)
}

watch(
    () => form.values.mp4File,
    (newVal) => {
        if (!newVal) {
            resetMp4()
        }
    }
)

interface ChatBotInstance {
    refetch: () => void
}

const chatBotRef = ref<ChatBotInstance | null>(null)
const id = ref(router.currentRoute.value.query.id as string)
const firstTimeToCallGPT = ref(true)
const previousRequestText = ref('')
const chatBotData = ref<TextToSpeechType | null>(null)

const checkSTT = computed(() => {
    return chatBotData.value?.title.startsWith('STT')
})
</script>

<template>
    <div class="p-3">
        <h1 class="mb-4 text-xl font-bold">{{ $t('title.speech-to-text') }}</h1>

        <div
            class="flex flex-col items-center gap-3 p-2 w-full mx-auto space-y-6 bg-white rounded-lg"
        >
            <AutoForm
                class="max-w-[800px] w-full"
                :form="form"
                :schema="schema"
                :field-config="{
                    title: {
                        label: $t('common.title'),
                        inputProps: {
                            placeholder: $t('placeholder.title')
                        }
                    },

                    mp4File: {
                        label: $t('common.video-mp4'),
                        component: 'file',
                        inputProps: {
                            onChange: handleChange,
                            class: 'cursor-pointer text-primary placeholder:text-primary'
                        }
                    },

                    wavFile: {
                        label: $t('common.wav-file'),
                        component: 'string'
                    }
                }"
                @submit="onSubmit"
            >
                <template #mp4File="slotProps">
                    <div class="flex items-end space-x-2">
                        <AutoFormField v-bind="slotProps" class="w-full" />
                        <Button
                            type="button"
                            size="sm"
                            class="mb-px"
                            @click="extractAudioAndChangeToWav"
                        >
                            To WAV
                        </Button>
                    </div>
                </template>
                <template #wavFile="slotProps">
                    <div class="flex items-end space-x-2">
                        <AutoFormField v-bind="slotProps" disabled class="w-full" />
                        <a v-if="data.wavLink" :href="data.wavLink" :download="form.values.wavFile">
                            <Button type="button" size="sm" class="mb-px"> Download WAV </Button>
                        </a>
                    </div>
                </template>

                <div class="p-2">
                    <Label class="text-xs">{{ $t('common.language') }}</Label>

                    <div class="bg-accent w-fit p-1 space-x-2 rounded">
                        <Button
                            type="button"
                            v-for="lang in LANGUAGES"
                            class="h-6 text-xs"
                            :class="settings.language !== lang && 'bg-white hover:bg-white/70'"
                            :variant="settings.language === lang ? 'default' : 'outline'"
                            @click="settings.language = lang"
                            >{{ lang }}</Button
                        >
                    </div>
                </div>

                <div class="flex items-center justify-end py-1">
                    <Button type="submit" size="sm">
                        <CheckIcon class="mr-1" />
                        {{ $t('common.submit') }}
                    </Button>
                </div>
            </AutoForm>
            <Chatbot
                v-if="speechToTextID"
                :key="forceRender"
                :id="speechToTextID"
                ref="chatBotRef"
                :previousRequestText="previousRequestText"
                :firstTimeToCallGPT="firstTimeToCallGPT"
                @closeFirstTimeToCallGPT="() => (firstTimeToCallGPT = false)"
                @setPreviousRequestText="(text: string) => (previousRequestText = text)"
                @update:parent-data="(d: TextToSpeechType) => (chatBotData = d)"
            />
            <!-- <section class="space-y-3">
                <div class="h-fit bg-accent flex flex-col items-center gap-1">
                    <Button
                        size="icon"
                        class="hover:bg-primary hover:text-primary-foreground text-primary bg-white"
                        @click="form.submitForm()"
                    >
                        <CheckIcon />
                    </Button>

                    <span class="text-xs text-gray-700 cursor-default">{{
                        $t('common.submit')
                    }}</span>
                </div>
            </section> -->
        </div>
    </div>
</template>
