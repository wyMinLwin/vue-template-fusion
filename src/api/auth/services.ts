import type { LoginPayload } from './types'
import axiosInstance from '../config'

const baseUrl = '/Authentication'

const login = async (credentials: LoginPayload) => {
    const request = await axiosInstance.post(`${baseUrl}/Login`, credentials)
    return request.data
}

export default { login }
