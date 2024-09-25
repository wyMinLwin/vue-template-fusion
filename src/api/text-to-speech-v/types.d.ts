export type ListAliasType = {
    textToMap: string
    alias: string
}

export type AddTtoSVPayload = {
    requestMessage: string
    languagedata: string
    languageSecond: string
    gender: string
    title: string
    listAlias: ListAliasType[]
}

export type AddSToTVPayload = {
    file: File
    languagedata: string
    title: string
}

export type TextToSpeechType = {
    textToSpeechID: string
    title: string
    text: string
    url: string
    createdAt: string
    updatedAt: string
    activeFlag: boolean
    segmentList: SegmentType[]
}

type SegmentType = {
    text: string
    startTime: number
    endTime: number
    confidence: number
}
