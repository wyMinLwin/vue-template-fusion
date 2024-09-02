import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/vue-query'
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
    useMutation: (opt?: UseMutationOptions<any, Error, CreateTodoPayload, any>) =>
        useMutation({
            mutationKey: ['getTodoAll'],
            mutationFn: (payload: CreateTodoPayload) => todoServices.addTodo(payload), // Pass the payload to the login function
            ...opt // additional options
        })
}
