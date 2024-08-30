import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import type { LoginPayload } from './types'

import authServices from './services'

export const loginMutation = {
    useMutation: (opt?: UseMutationOptions<any, Error, LoginPayload, any>) =>
        useMutation({
            mutationKey: ['login'],
            mutationFn: (payload: LoginPayload) => authServices.login(payload), // Pass the payload to the login function
            ...opt // additional options
        })
}
