import axios from 'axios'
import Cookies from 'js-cookie'

export type APIResponse<T> = {
    message: string
    status: number
    data: T
}

const axiosInstance = axios.create({
    baseURL: 'https://crc-api-test.azurewebsites.net/api/v1/',
    timeout: 10000, // Optional: Set a timeout for requests (in milliseconds)
    headers: {
        'Content-Type': 'application/json'
    }
    // Add more default configurations if needed
})

// Interceptors can be added to handle requests and responses globally
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('template-app-token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        // Add authorization or other headers if needed
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
