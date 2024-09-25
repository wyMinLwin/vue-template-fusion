import axiosInstance, { type APIResponse } from '../config'
import type { AddTtoSPayload, TextToSpeechType, UpdateTTSPayload } from './types'

const baseUrl = '/TextToSpeech'

const fetchTextToSpeechHistory = async (): Promise<APIResponse<TextToSpeechType[]>> => {
    const response = await axiosInstance.get<APIResponse<TextToSpeechType[]>>(
        `${baseUrl}/GetTextToSpeechHistory`
    )

    return response.data
}

const fetchTextToSpeechHistoryByID = async (id: string): Promise<APIResponse<TextToSpeechType>> => {
    const response = await axiosInstance.get<APIResponse<TextToSpeechType>>(
        `${baseUrl}/GetTextToSpeechHistoryByID?TextToSpeechID=${id}`
    )

    return response.data
}

const addTextToSpeech = async (payload: AddTtoSPayload) => {
    const response = await axiosInstance.post(`${baseUrl}/AddTextToSpeech`, payload)

    return response.data
}

const updateTextToSpeech = async (payload: UpdateTTSPayload) => {
    const response = await axiosInstance.post(`${baseUrl}/UpdateTextToSpeech`, payload)

    return response.data
}

export default {
    fetchTextToSpeechHistory,
    addTextToSpeech,
    fetchTextToSpeechHistoryByID,
    updateTextToSpeech
}
