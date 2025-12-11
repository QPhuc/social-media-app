import { http } from "./http"
import type { BaseApi } from "./types/api"

export function createApi<
	TItem,
	TCreate = TItem,
	TUpdate = TCreate,
	TList = TItem[],
>(baseUrl: string): BaseApi<TItem, TCreate, TUpdate, TList> {
	return {
		getAll: (params?: Record<string, unknown>) =>
			http.get<TList>(baseUrl, params),

		getById: (id) => http.get<TItem>(`${baseUrl}/${id}`),

		create: (data) => http.post<TCreate, TItem>(baseUrl, data),

		update: (id, data) =>
			http.put<TUpdate, TItem>(`${baseUrl}/${id}`, data),

		patch: (id, data) =>
			http.patch<Partial<TUpdate>, TItem>(`${baseUrl}/${id}`, data),

		remove: (id) => http.delete<void>(`${baseUrl}/${id}`),
	}
}
