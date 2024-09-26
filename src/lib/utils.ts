import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export const ssmlWriter = (lang: string, model: number, sanitizedText: string) => {
    switch (model) {
        case 195:
            return `
            <speak version='1.0' xml:lang='${lang}'>
              <voice xml:lang='${lang}' xml:gender='Female' name='${lang === 'th-TH' ? 'th-TH-PremwadeeNeural' : 'en-US-LunaNeural'}'>
                ${sanitizedText}
              </voice>
            </speak>`
        case 194:
            return `
            <speak version='1.0' xml:lang='${lang}'>
              <voice xml:lang='${lang}' xml:gender='Female' name='${lang === 'th-TH' ? 'th-TH-AcharaNeural' : 'en-US-JennyMultilingualNeural'}'>
                ${sanitizedText}
              </voice>
            </speak>`
        case 196:
            return `
            <speak version='1.0' xml:lang='${lang}'>
              <voice xml:lang='${lang}' xml:gender='Male' name='${lang === 'th-TH' ? 'th-TH-NiwatNeural' : 'en-US-AndrewMultilingualNeural'}'>
                ${sanitizedText}
              </voice>
            </speak>`
        default:
            return `
            <speak version='1.0' xml:lang='${lang}'>
              <voice xml:lang='${lang}' xml:gender='Female' name='${lang === 'th-TH' ? 'th-TH-PremwadeeNeural' : 'en-US-LunaNeural'}'>
                ${sanitizedText}
              </voice>
            </speak>`
    }
  }
  
  export const removeMarkdown = (markdownText: string): string => {
  // Regular expression to match Markdown syntax elements
  const markdownRegex = /(\*\*|__|\*|_|~~|`|\[.*?\]\(.*?\))/g;
  // First, remove Markdown headers, allowing for optional leading spaces
  const withoutHeaders = markdownText.replace(/^\s*(#+)\s*/gm, '');
  // Then, replace other Markdown syntax with empty string
  return withoutHeaders.replace(markdownRegex, '');
  }
