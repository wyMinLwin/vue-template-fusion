import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import logServices from './services'
import type { LogEntryType } from './types'
import type { APIResponse } from '../config'

export const fetchLogs = {
    useQuery: (opt?: UseQueryOptions<LogEntryType[], Error>) =>
        useQuery<LogEntryType[], Error>({
            queryKey: ['getLogs'],
            queryFn: async () => {
                const response: APIResponse<LogEntryType[]> = await logServices.getLogs()

                return response.data
            },
            ...opt
        })
}
