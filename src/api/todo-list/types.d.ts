export type TodoType = {
    activeFlag: boolean
    createdAt: string
    description: string
    id: string
    title: string
    updatedAt: string
    status: 'In Progress' | 'Completed' | 'Not Started'
}

export type CreateTodoPayload = {
    title: string
    updatedAt: string
    status: 'In Progress' | 'Completed' | 'Not Started'
}