import axiosInstance from '../config'
import type { AddTtoSVPayload, AddSToTVPayload } from './types'

const baseUrl = '/TextToSpeechV'

const addTextToSpeech = async (payload: AddTtoSVPayload) => {
    const response = await axiosInstance.post(`${baseUrl}/AddTextToSpeech`, payload)

    return response.data
}

const addSpeechToText = async (payload: AddSToTVPayload) => {
    const formData = new FormData()
    console.log("🚀 ~ addSpeechToText ~ payload.file:", payload.file)

    formData.append('AudioFile', payload.file)
    formData.append('Languagedata', payload.languagedata)
    formData.append('Title', payload.title)

    const response = await axiosInstance.post(`${baseUrl}/AddSpeechToText`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data
}

export default { addTextToSpeech, addSpeechToText }
