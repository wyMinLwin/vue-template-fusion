export type LogEntryType = {
    logId: number
    userName: string
    userId: number
    ip: string
    laptopModel: string | null
    description: string
    logType: string
    methodName: string
    exception: string
    logTrace: string
    createDate: string
    activeFlag: boolean
}
