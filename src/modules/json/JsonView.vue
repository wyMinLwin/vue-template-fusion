<script setup lang="ts">
// @ts-nocheck
import { EXAMPLE_RESPONSE_DATA, LANGUAGE_CHOICES, URL } from './data'

import { ref } from 'vue'
import * as z from 'zod'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import axios, { AxiosError } from 'axios'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from '@/components/ui/toast'
import { useLoaderStore } from '@/stores/loaderStore'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import ResponseExample from './chunks/ResponseExample.vue'
import CopyButton from '@/components/button-with-functions/CopyButton.vue'
import CodeExample from './chunks/CodeExample.vue'

const { t } = useI18n()
const { loadingOn, loadingOff } = useLoaderStore()

const formSchema = toTypedSchema(
    z.object({
        title: z
            .string({
                required_error: t('error-msg.required')
            })
            .min(2),

        audioFile: z.instanceof(File),
        language: z.string({
            required_error: t('error-msg.required')
        }),
        token: z.string({
            required_error: t('error-msg.required')
        })
    })
)

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        language: 'en-US'
    }
})

const responseData = ref(EXAMPLE_RESPONSE_DATA)

const submitForm = handleSubmit(async (values) => {
    try {
        loadingOn()

        const formData = new FormData()

        formData.append('AudioFile', values.audioFile)
        formData.append('Title', values.title)
        formData.append('Language', values.language)

        const response = await axios.post(URL, formData, {
            headers: {
                Authorization: `Bearer ${values.token}`,
                accept: '*/*'
            }
        })

        responseData.value = response.data

        toast({ title: 'Speech To Text requested Successfully', variant: 'success' })
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 401) {
                toast({
                    title: 'Unauthorized: Invalid token or access denied',
                    variant: 'destructive'
                })
            } else {
                toast({ title: 'An error occurred', variant: 'destructive' })
            }
        } else {
            console.error('Unexpected error:', error)
            toast({ title: 'An error occurred', variant: 'destructive' })
        }
    } finally {
        loadingOff()
    }
})
</script>

<template>
    <div class="m-4 bg-white">
        <h4 class="p-3 pb-0 text-xl font-bold">Json</h4>

        <div class="grid grid-cols-2 gap-3 py-3">
            <section class="px-3">
                <div class="mb-4">
                    <Label>URL</Label>

                    <div class="relative">
                        <Input
                            :model-value="URL"
                            aria-label="URL"
                            disabled
                            class="disabled:cursor-text pr-9"
                        />

                        <CopyButton :text="URL" class="absolute top-0 right-0"></CopyButton>
                    </div>
                </div>

                <div>
                    <div>
                        <div class="mb-3">
                            <h5>Request</h5>
                            <Separator />
                        </div>

                        <form class="space-y-2" @submit.prevent="submitForm">
                            <FormField v-slot="{ componentField, value }" name="title">
                                <FormItem class="space-y-0">
                                    <FormLabel
                                        >Title <span class="text-destructive">*</span></FormLabel
                                    >

                                    <div class="data-type">Data type: string</div>
                                    <FormControl>
                                        <div class="relative">
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                class="pr-9"
                                                v-bind="componentField"
                                            />

                                            <CopyButton
                                                :text="value ?? ''"
                                                class="absolute top-0 right-0"
                                            ></CopyButton>
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <FormField v-slot="{ componentField, field }" name="audioFile">
                                <FormItem class="space-y-0">
                                    <FormLabel
                                        >Audio File
                                        <span class="text-destructive">*</span></FormLabel
                                    >

                                    <div class="data-type">Data type: string</div>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="audio/*"
                                            placeholder="Audio File"
                                            @change="
                                                (e: Event) => {
                                                    const target = e.target as HTMLInputElement
                                                    const file = target.files
                                                        ? target.files[0]
                                                        : null
                                                    field.onChange(file)
                                                }
                                            "
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <FormField v-slot="{ componentField }" name="language">
                                <FormItem class="space-y-0">
                                    <FormLabel>Language</FormLabel>

                                    <div class="data-type">Data type: string</div>
                                    <Select v-bind="componentField">
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem
                                                    v-for="choice in LANGUAGE_CHOICES"
                                                    :key="choice.value"
                                                    :value="choice.value"
                                                >
                                                    {{ choice.text }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <FormField v-slot="{ componentField, value }" name="token">
                                <FormItem class="space-y-0">
                                    <FormLabel
                                        >Token <span class="text-destructive">*</span></FormLabel
                                    >

                                    <div class="data-type">Data type: string</div>
                                    <FormControl>
                                        <div class="relative">
                                            <Input
                                                type="text"
                                                placeholder="Token"
                                                class="pr-9"
                                                v-bind="componentField"
                                            />

                                            <CopyButton
                                                :text="value ?? ''"
                                                class="absolute top-0 right-0"
                                            ></CopyButton>
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </form>
                    </div>

                    <div>
                        <div class="my-3">
                            <div class="flex items-center justify-between mb-1">
                                <h5>Response</h5>

                                <Button @click="submitForm">Call Service</Button>
                            </div>
                            <Separator />
                        </div>

                        <ResponseExample :responseData="responseData" />
                    </div>
                </div>
            </section>

            <section class="px-3">
                <CodeExample :values="values" :url="URL" />
            </section>
        </div>
    </div>
</template>

<style scoped>
.data-type {
    @apply bg-gray-200 w-fit text-xs px-px;

    margin-block: 4px !important;
}
</style>
