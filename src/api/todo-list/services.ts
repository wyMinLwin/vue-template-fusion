import axiosInstance, { type APIResponse } from '../config'
import type { CreateTodoPayload, TodoType } from './types'
const baseUrl = '/Todo'

const getTodoAll = async (): Promise<APIResponse<TodoType[]>> => {
    const response = await axiosInstance.get<APIResponse<TodoType[]>>(`${baseUrl}/GetTodoAll`)

    return response.data
}

const addTodo = async (todo: CreateTodoPayload): Promise<APIResponse<TodoType>> => {
    const response = await axiosInstance.post<APIResponse<TodoType>>(`${baseUrl}/AddTodo`, todo)

    return response.data
}

export default { getTodoAll, addTodo }
