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
        // Check if the response status is 200 and the API response status is 0
        if (response.status === 200) {
            if (response.data.status === 0) {
                // Return the data part of the API response
                return response
            } else {
                // Handle API-specific errors (e.g., status not 0)
                return Promise.reject(
                    new Error(`API error: ${response.data.message || 'Unknown error'}`)
                )
            }
        } else {
            // Handle HTTP status codes that are not 200
            return Promise.reject(new Error(`HTTP error: ${response.status}`))
        }
    },
    (error) => {
        // Handle errors that occur during the request or response
        const message = error.response?.data?.message || error.message || 'An error occurred'
        return Promise.reject(new Error(message))
    }
)

export default axiosInstance
