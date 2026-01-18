export interface User {
	id: number
	name: string
	email?: string
	avatar?: string
}

export interface Post {
	id: number
	content: string
	imageUrl?: string
	nrOfReports: number
	isPrivate: boolean
	isDeleted: boolean
	dateCreated: string
	dateUpdated: string
	userId: number
	user: User
	likes: Like[]
	comments: Comment[]
	favorites: Favorite[]
}

export interface Like {
	id: number
	userId: number
	postId: number
	dateCreated: string
}

export interface Comment {
	id: number
	content: string
	userId: number
	postId: number
	user: User
	dateCreated: string
	dateUpdated: string
}

export interface Favorite {
	id: number
	userId: number
	postId: number
	dateCreated: string
}

export interface CreatePostDTO {
	content: string
	imageUrl?: string
	isPrivate?: boolean
}
