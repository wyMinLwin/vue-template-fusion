<script setup lang="ts">
import type { AddTtoSVPayload, ListAliasType } from '@/api/text-to-speech-v/types'
import type { GenderType, LanguageType } from '@/shared/global'
import { fetchHistoryByID } from '@/api/text-to-speech/queries'

import { GENDER, LANGUAGES, MODELS } from '@/shared/constants'
import { CheckIcon, LayersIcon } from '@radix-icons/vue'

import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { useLoaderStore } from '@/stores/loaderStore'
import { addTextToSpeechVMutation } from '@/api/text-to-speech-v/queries'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AutoForm } from '@/components/ui/auto-form'
import AudioAndContent from './chunks/AudioAndContent.vue'

const CUSTOM_VOICE_MODELS = [
    {
        value: 'normal',
        text: 'Normal'
    },
    {
        value: 'customVoice',
        text: 'Nopporn Neutral'
    },
    {
        value: 'customVoice2',
        text: 'Nopporn Neutral v2'
    }
] as const

const { t } = useI18n()
const router = useRouter()
const { loadingOn, loadingOff } = useLoaderStore()

const schema = z.object({
    title: z
        .string({
            required_error: t('error-msg.required')
        })
        .min(2, {
            message: t('error-msg.min-2-characters')
        }),

    text: z
        .string({
            required_error: t('error-msg.required')
        })
        .min(2, {
            message: t('error-msg.min-2-characters')
        })
})

const settings = reactive({
    language: 'th-TH' as LanguageType,
    gender: 'Male' as GenderType,
    customVoice: false
})
const textMappings = ref<ListAliasType[]>([])
const voiceModelChoice = ref<(typeof CUSTOM_VOICE_MODELS)[number]['value']>('normal')

const addMapping = () => {
    if (textMappings.value.length) {
        const lastMapped = textMappings.value[textMappings.value.length - 1]
        if (!Object.values(lastMapped).every((v) => v)) return
    }

    textMappings.value.push({
        textToMap: '',
        alias: ''
    })
}

const removeMapping = (index: number) => {
    textMappings.value.splice(index, 1)
}

const showCustomVoice = computed(() => {
    return settings.language == 'th-TH' && settings.gender === 'Male'
})

const canSubmit = computed(() => {
    return textMappings.value.every((t) => form.values.text?.includes(t.textToMap))
})

const form = useForm({
    validationSchema: toTypedSchema(schema)
})

const speechToTextID = ref("")
const forceRender = ref(0);
// const { data, isLoading, refetch } = fetchHistoryByID.useQuery(speechToTextID.value,false)

const { mutate: addTextToSpeech } = addTextToSpeechVMutation.useMutation({
    onMutate: loadingOn,
    onSuccess: (data) => {
        speechToTextID.value = data.data;
        forceRender.value++;
        form.resetForm()
        // refetch()
    },
    onError: (error) => {
        console.error('Error:', error)

        toast({
            title: t('error-msg.upload-audio-fail'),
            description: t('error-msg.upload-audio-error'),
            variant: 'destructive'
        })
    },
    onSettled: loadingOff
})

function onSubmit(values: Record<string, any>) {
    const payload: AddTtoSVPayload = {
        requestMessage: values.text,
        languagedata: settings.language,
        languageSecond: MODELS[voiceModelChoice.value][settings.language],
        gender: settings.gender,
        title: values.title,
        listAlias: textMappings.value
    }

    addTextToSpeech(payload)
}
</script>

<template>
    <div class="p-3">
        <h1 class="mb-4 text-xl font-bold">{{ $t('title.text-to-speech') }}</h1>

        <div class="flex gap-3">
            <AutoForm
                class="max-w-[800px] pb-3 p-2 w-full mx-auto space-y-6 bg-white rounded-lg"
                :form="form"
                :schema="schema"
                :field-config="{
                    title: {
                        label: $t('common.title'),
                        inputProps: {
                            placeholder: $t('placeholder.title')
                        }
                    },

                    text: {
                        label: $t('common.content'),
                        component: 'textarea',
                        inputProps: {
                            placeholder: $t('placeholder.content'),
                            class: 'min-h-[100px]'
                        }
                    }
                }"
                @submit="onSubmit"
            >
                <!-- Text Map Section -->
                <!-- <section class="space-y-2">
                    <h4 class="text-sm font-semibold">{{ $t('common.text-mapping') }}</h4>

                    <div v-if="textMappings.length" class="flex gap-3">
                        <div class="grow gap-x-4 grid grid-cols-2 text-sm font-semibold">
                            <h4 class="px-2">{{ $t('common.map-text') }}</h4>
                            <h4 class="px-2">{{ $t('common.alias-text') }}</h4>
                        </div>

                        <div class="w-[50px]"></div>
                    </div>

                    <div v-for="(ms, i) in textMappings" :key="i" class="flex flex-wrap gap-3">
                        <div class="grow gap-x-4 grid grid-cols-2">
                            <Input
                                v-model="ms.textToMap"
                                aria-label="Map Text"
                                placeholder="Map Text"
                                class="mx-2"
                                :class="
                                    form.values.text?.includes(ms.textToMap)
                                        ? 'focus-visible:ring-success'
                                        : 'focus-visible:ring-destructive'
                                "
                            />

                            <Input
                                v-model="ms.alias"
                                aria-label="Alias Text"
                                placeholder="Alias Text"
                                class="mx-2"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            class="w-[50px] text-destructive hover:text-destructive"
                            @click="removeMapping(i)"
                        >
                            <TrashIcon class="w-5 h-5" />
                        </Button>

                        <div
                            v-if="ms.textToMap && !form.values.text?.includes(ms.textToMap)"
                            class="flex w-full gap-3"
                        >
                            <p id="errorText" class="grow text-destructive text-xs text-center">
                                This text is not in content.
                            </p>

                            <div class="w-[50px]"></div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center p-2">
                        <Button
                            type="button"
                            class="flex items-center h-8 gap-1.5 text-xs"
                            @click="addMapping"
                        >
                            <LoopIcon />
                            {{ $t('common.add-mapping') }}
                        </Button>

                        <div class="w-[50px]"></div>
                    </div>
                </section> -->

                <section class="gap-x-4 grid items-center grid-cols-3">
                    <h4 class="col-span-3 text-sm font-semibold">{{ $t('common.settings') }}</h4>

                    <div class="p-2">
                        <Label class="text-xs">{{ $t('common.gender') }}</Label>

                        <div class="bg-accent w-fit p-1 space-x-2 rounded">
                            <Button
                                type="button"
                                v-for="g in GENDER"
                                class="h-6 text-xs"
                                :class="settings.gender !== g && 'bg-white hover:bg-white/70'"
                                :variant="settings.gender === g ? 'default' : 'outline'"
                                @click="settings.gender = g"
                                >{{ g }}</Button
                            >
                        </div>
                    </div>

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

                    <div v-if="showCustomVoice" class="p-2">
                        <Label class="text-xs">{{ $t('common.models') }}</Label>

                        <Select v-model="voiceModelChoice">
                            <SelectTrigger class="h-7 bg-accent text-sm border-0">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        v-for="m in CUSTOM_VOICE_MODELS"
                                        :key="m.value"
                                        :value="m.value"
                                    >
                                        {{ m.text }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                <div class="flex justify-end">
                    <Button type="submit" size="sm" :disabled="!canSubmit">
                        <CheckIcon class="mr-1" />{{ $t('common.submit') }}
                    </Button>
                </div>
                <AudioAndContent :key="forceRender" v-if="speechToTextID" :id="speechToTextID" />
            </AutoForm>
        </div>
    </div>
</template>
