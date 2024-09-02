import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/vue-query'
import todoServices from './services'
import type { CreateTodoPayload, TodoType } from './types'
import type { APIResponse } from '../config'

export const fetchTodos = {
    useQuery: (opt?: UseQueryOptions<TodoType[], Error>) =>
        useQuery<TodoType[], Error>({
            queryKey: ['getTodoAll'],
            queryFn: async () => {
                const response: APIResponse<TodoType[]> = await todoServices.getTodoAll()

                return response.data
            },
            ...opt
        })
}

export const addTodo = {
    useMutation: (opt?: UseMutationOptions<any, Error, CreateTodoPayload, any>) => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationKey: ['addTodoAll'],
            mutationFn: (payload: CreateTodoPayload) => todoServices.addTodo(payload), 
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['getTodoAll'] })
            },
            ...opt
        })
    }
        
}
