import axios from "axios"

let accessToken: string | null = null

const api = axios.create({
	baseURL: `/api`,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
})

api.interceptors.request.use(
	async (config) => {
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => Promise.reject(error),
)

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			// Call refresh endpoint
			const res = await api.post("/auth/refresh")
			accessToken = res.data.accessToken
			originalRequest.headers.Authorization = `Bearer ${accessToken}`
			return api(originalRequest)
		}
		return Promise.reject(error)
	},
)

export const setAccessToken = (token: string) => {
	accessToken = token
}

export default api
