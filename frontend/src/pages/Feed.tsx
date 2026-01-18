import { Icon } from "@iconify/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CreatePostModal from "@/components/CreatePostModal"
import PostCard from "@/components/PostCard"
import type { Post } from "@/lib/types/post"

// Mock data - replace with actual API call
const mockPosts: Post[] = [
	{
		id: 1,
		content:
			"Just launched my new project! 🚀 So excited to share this with everyone. What do you think?",
		imageUrl:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
		nrOfReports: 0,
		isPrivate: false,
		isDeleted: false,
		dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		dateUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		userId: 1,
		user: {
			id: 1,
			name: "John Doe",
			email: "john@example.com",
			avatar: "https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff",
		},
		likes: [
			{
				id: 1,
				userId: 2,
				postId: 1,
				dateCreated: new Date().toISOString(),
			},
		],
		comments: [
			{
				id: 1,
				content: "Looks amazing! Great work! 🎉",
				userId: 2,
				postId: 1,
				dateCreated: new Date(
					Date.now() - 1 * 60 * 60 * 1000,
				).toISOString(),
				dateUpdated: new Date(
					Date.now() - 1 * 60 * 60 * 1000,
				).toISOString(),
				user: {
					id: 2,
					name: "Jane Smith",
					email: "jane@example.com",
					avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=fff",
				},
			},
		],
		favorites: [],
	},
	{
		id: 2,
		content:
			"Beautiful sunset today! Nature never fails to amaze me. 🌅 #sunset #nature #photography",
		imageUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
		nrOfReports: 0,
		isPrivate: false,
		isDeleted: false,
		dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		dateUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		userId: 2,
		user: {
			id: 2,
			name: "Jane Smith",
			email: "jane@example.com",
			avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=fff",
		},
		likes: [
			{
				id: 2,
				userId: 1,
				postId: 2,
				dateCreated: new Date().toISOString(),
			},
			{
				id: 3,
				userId: 3,
				postId: 2,
				dateCreated: new Date().toISOString(),
			},
		],
		comments: [],
		favorites: [],
	},
	{
		id: 3,
		content:
			"Quick reminder: Take breaks, stay hydrated, and remember that you're doing great! 💙",
		nrOfReports: 0,
		isPrivate: false,
		isDeleted: false,
		dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		dateUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		userId: 3,
		user: {
			id: 3,
			name: "Alex Johnson",
			email: "alex@example.com",
			avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=10B981&color=fff",
		},
		likes: [],
		comments: [
			{
				id: 2,
				content: "Thanks for the reminder! 😊",
				userId: 1,
				postId: 3,
				dateCreated: new Date(
					Date.now() - 23 * 60 * 60 * 1000,
				).toISOString(),
				dateUpdated: new Date(
					Date.now() - 23 * 60 * 60 * 1000,
				).toISOString(),
				user: {
					id: 1,
					name: "John Doe",
					email: "john@example.com",
					avatar: "https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff",
				},
			},
		],
		favorites: [],
	},
]

const Feed = () => {
	const navigate = useNavigate()
	const [posts] = useState<Post[]>(mockPosts)
	const [showCreatePostModal, setShowCreatePostModal] = useState(false)

	return (
		<div className="max-w-2xl mx-auto py-6 px-4">
			{/* Create Post Modal */}
			<CreatePostModal
				isOpen={showCreatePostModal}
				onClose={() => setShowCreatePostModal(false)}
			/>

			{/* Create Post Button/Card */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
				<div className="flex items-center gap-3">
					<img
						alt="Your avatar"
						className="w-10 h-10 rounded-full object-cover"
						src="https://ui-avatars.com/api/?name=You&background=random"
					/>
					<button
						className="flex-1 text-left bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
						onClick={() => setShowCreatePostModal(true)}
						type="button"
					>
						What's on your mind?
					</button>
				</div>
			</div>

			{/* Stories Section (Optional) */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 overflow-x-auto">
				<div className="flex gap-3">
					{/* Add Story */}
					<button
						className="flex-shrink-0 text-center group"
						onClick={() => navigate("/stories/create")}
						type="button"
					>
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
							<Icon
								className="text-white"
								icon="solar:add-circle-bold"
								width="32"
							/>
						</div>
						<span className="text-xs text-gray-600 dark:text-gray-400">
							Add Story
						</span>
					</button>
					{/* Mock Stories */}
					{mockPosts.slice(0, 5).map((post) => (
						<button
							className="flex-shrink-0 text-center group"
							key={post.id}
							type="button"
						>
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 p-0.5 mb-1 group-hover:scale-105 transition-transform">
								<img
									alt={post.user.name}
									className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
									src={post.user.avatar}
								/>
							</div>
							<span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[64px]">
								{post.user.name.split(" ")[0]}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Posts Feed */}
			<div className="space-y-4">
				{posts.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
						<Icon
							className="mx-auto text-gray-400 mb-4"
							icon="solar:feed-bold-duotone"
							width="64"
						/>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							No posts yet
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							Follow some people to see their posts in your feed
						</p>
					</div>
				) : (
					posts.map((post) => <PostCard key={post.id} post={post} />)
				)}
			</div>

			{/* Load More */}
			{posts.length > 0 && (
				<div className="text-center mt-6">
					<button
						className="px-6 py-3 text-blue-500 hover:text-blue-600 font-medium transition-colors"
						type="button"
					>
						Load more posts
					</button>
				</div>
			)}
		</div>
	)
}

export default Feed
