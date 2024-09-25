export type AddTtoSPayload = {
    requestMessage: string
    languagedata: string
    languageSecond: string
    gender: string
    title: string
}

export type UpdateTTSPayload = {
    createdAt: string
    updatedAt: string
    activeFlag: boolean
    textToSpeechID: string
    title: string
    text: string
    url: string
    language: string
    segmentList: SegmentType[]
    aliasList: AliasType[]
}

export type TextToSpeechType = {
    textToSpeechID: string
    title: string
    text: string
    url: string
    createdAt: string
    updatedAt: string
    activeFlag: boolean
    language: string
    segmentList: SegmentType[]
    aliasList: AliasType[]
}

export type SegmentType = {
    text: string
    startTime: number
    endTime: number
    confidence: number
}

export type AliasType = {
    alias: string
    textToMap: string
}
