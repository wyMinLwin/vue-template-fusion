import axiosInstance, { type APIResponse } from '../config'
import type { LogEntryType } from './types'

const baseUrl = '/Log'

const getLogs = async (): Promise<APIResponse<LogEntryType[]>> => {
    const response = await axiosInstance.get<APIResponse<LogEntryType[]>>(`${baseUrl}/GetLog`)

    return response.data
}

export default { getLogs }
