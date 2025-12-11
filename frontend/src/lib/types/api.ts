export interface BaseApi<
	TItem,
	TCreate = TItem,
	TUpdate = TCreate,
	TList = TItem[],
	TParams extends Record<string, unknown> = Record<string, unknown>,
> {
	getAll: (params?: TParams) => Promise<TList>
	getById: (id: string | number) => Promise<TItem>
	create: (data: TCreate) => Promise<TItem>
	update: (id: string | number, data: TUpdate) => Promise<TItem>
	patch: (id: string | number, data: Partial<TUpdate>) => Promise<TItem>
	remove: (id: string | number) => Promise<void>
}
