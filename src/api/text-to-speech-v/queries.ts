import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import textToSpeechServices from './services'
import type { AddTtoSVPayload, AddSToTVPayload } from './types'

export const addTextToSpeechVMutation = {
    useMutation: (opt?: UseMutationOptions<any, Error, AddTtoSVPayload, any>) =>
        useMutation({
            mutationKey: ['addTextToSpeech'],
            mutationFn: (payload: AddTtoSVPayload) => textToSpeechServices.addTextToSpeech(payload),
            ...opt
        })
}

export const addSpeechToTextVMutation = {
    useMutation: (opt?: UseMutationOptions<any, Error, AddSToTVPayload, any>) =>
        useMutation({
            mutationKey: ['addSpeechToText'],
            mutationFn: (payload: AddSToTVPayload) => textToSpeechServices.addSpeechToText(payload),
            ...opt
        })
}
