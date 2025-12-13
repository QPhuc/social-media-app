import api from "./axios"

export const http = {
	get: async <R = unknown>(
		url: string,
		params?: Record<string, unknown>,
	): Promise<R> => {
		const res = await api.get<R>(url, { params })
		return res as R
	},

	post: async <T, R = T>(url: string, data: T): Promise<R> => {
		const res = await api.post<R>(url, data)
		return res as R
	},

	put: async <T, R = T>(url: string, data: T): Promise<R> => {
		const res = await api.put<R>(url, data)
		return res as R
	},

	patch: async <T, R = T>(url: string, data: T): Promise<R> => {
		const res = await api.patch<R>(url, data)
		return res as R
	},

	delete: async <R = unknown>(url: string): Promise<R> => {
		const res = await api.delete<R>(url)
		return res as R
	},
}
