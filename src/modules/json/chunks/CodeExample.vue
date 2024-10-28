<script setup lang="ts">
import { API_VERSIONS } from '../data'

import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { computed } from 'vue'

import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import CopyButton from '@/components/button-with-functions/CopyButton.vue'

type ValuesType = {
    title?: string
    audioFile: File 
    language?: string
    token?: string
}

const props = defineProps<{
    values: ValuesType
    url: string
}>()

const highlighter = (code: string) => highlight(code, languages.javascript, 'javascript')

const axiosCode = computed(() => {
    const audioFilePath = props.values.audioFile
        ? `path/to/your/file/${props.values.audioFile.name ?? ''}`
        : 'path/to/your/file/your_audio.wav'

    const formTitle = props.values.title
        ? `formData.append('Title', '${props.values.title ?? ''}');\n`
        : ''
    const formAudioFile = `formData.append('AudioFile', fs.createReadStream('${audioFilePath}'), { filename: '${props.values.audioFile ? props.values.audioFile.name : ''}', contentType: ${props.values.audioFile ? props.values.audioFile.type : ''} });\n`
    const formLanguage = props.values.language
        ? `formData.append('Language', '${props.values.language}');\n`
        : ''

    return `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const formData = new FormData();
${formTitle}${formAudioFile}${formLanguage}
axios.post('${props.url}', formData, {
    headers: {
        'Authorization': 'Bearer ${props.values.token ?? ''}',
        'accept': '*/*',
        ...formData.getHeaders()
    }
})
.then(response => {
    console.log(JSON.stringify(response.data));
})
.catch(error => {
    console.error(error);
});`
})

const test = computed(() => {
    console.log(props.values.audioFile)

    return ''
})

const curlCode = computed(() => {
    return `curl -X 'POST' \\
  '${props.url}' \\
  -H 'accept: */*' \\
  -H 'Authorization: Bearer ${props.values.token ?? ''}' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'Title=${props.values.title ?? ''}' \\
  -F 'AudioFile=@${props.values.audioFile ? props.values.audioFile.name : ''};type=audio/wav' \\
  -F 'Language=${props.values.language}'`
})
</script>

<template>
    <div class="flex flex-col items-end gap-2">
        <div class="min-w-[240px]">
            {{ test }}
            <Label>Versions</Label>

            <Select :default-value="API_VERSIONS[0]">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="ver in API_VERSIONS" :value="ver">
                            {{ ver }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <div class="w-full">
            <div class="data-type">Example: axios</div>

            <div class="relative">
                <PrismEditor
                    class="editor"
                    v-model="axiosCode"
                    :highlight="highlighter"
                    line-numbers
                ></PrismEditor>

                <CopyButton
                    :text="axiosCode"
                    class="hover:bg-black hover:text-white active:text-white absolute top-0 right-0 text-white"
                ></CopyButton>
            </div>
        </div>

        <div class="w-full">
            <div class="data-type">Example: curl</div>

            <div class="relative">
                <PrismEditor
                    class="editor"
                    v-model="curlCode"
                    :highlight="highlighter"
                    line-numbers
                ></PrismEditor>

                <CopyButton
                    :text="curlCode"
                    class="hover:bg-black hover:text-white active:text-white absolute top-0 right-0 text-white"
                ></CopyButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.data-type {
    @apply bg-gray-200 w-fit text-xs px-px;

    margin-block: 4px !important;
}
</style>
