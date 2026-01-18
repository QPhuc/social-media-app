import { Icon } from "@iconify/react"
import { useState } from "react"
import type { Post } from "@/lib/types/post"

interface PostCardProps {
	post: Post
}

const PostCard = ({ post }: PostCardProps) => {
	const [isLiked, setIsLiked] = useState(false)
	const [isSaved, setIsSaved] = useState(false)
	const [showComments, setShowComments] = useState(false)
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0)

	const handleLike = () => {
		setIsLiked(!isLiked)
		setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
	}

	const handleSave = () => {
		setIsSaved(!isSaved)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return "Just now"
		if (diffMins < 60) return `${diffMins}m ago`
		if (diffHours < 24) return `${diffHours}h ago`
		if (diffDays < 7) return `${diffDays}d ago`
		return date.toLocaleDateString()
	}

	return (
		<article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
			{/* Post Header */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<img
						alt={post.user.name}
						className="w-10 h-10 rounded-full object-cover"
						src={
							post.user.avatar ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=random`
						}
					/>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white">
							{post.user.name}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{formatDate(post.dateCreated)}
						</p>
					</div>
				</div>
				<button
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					type="button"
				>
					<Icon icon="solar:menu-dots-bold" width="24" />
				</button>
			</div>

			{/* Post Content */}
			<div className="px-4 pb-3">
				<p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
					{post.content}
				</p>
			</div>

			{/* Post Image */}
			{post.imageUrl && (
				<div className="w-full">
					<img
						alt="Post content"
						className="w-full object-cover max-h-[600px]"
						src={post.imageUrl}
					/>
				</div>
			)}

			{/* Post Actions */}
			<div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-4">
						<button
							className={`flex items-center gap-2 transition-colors ${
								isLiked
									? "text-red-500"
									: "text-gray-600 dark:text-gray-400 hover:text-red-500"
							}`}
							onClick={handleLike}
							type="button"
						>
							<Icon
								icon={
									isLiked
										? "solar:heart-bold"
										: "solar:heart-bold-duotone"
								}
								width="24"
							/>
							{likesCount > 0 && (
								<span className="text-sm font-medium">
									{likesCount}
								</span>
							)}
						</button>
						<button
							className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
							onClick={() => setShowComments(!showComments)}
							type="button"
						>
							<Icon
								icon="solar:chat-round-bold-duotone"
								width="24"
							/>
							{post.comments && post.comments.length > 0 && (
								<span className="text-sm font-medium">
									{post.comments.length}
								</span>
							)}
						</button>
						<button
							className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
							type="button"
						>
							<Icon icon="solar:share-bold-duotone" width="24" />
						</button>
					</div>
					<button
						className={`transition-colors ${
							isSaved
								? "text-yellow-500"
								: "text-gray-600 dark:text-gray-400 hover:text-yellow-500"
						}`}
						onClick={handleSave}
						type="button"
					>
						<Icon
							icon={
								isSaved
									? "solar:bookmark-bold"
									: "solar:bookmark-bold-duotone"
							}
							width="24"
						/>
					</button>
				</div>
			</div>

			{/* Comments Section */}
			{showComments && post.comments && post.comments.length > 0 && (
				<div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
					<div className="mt-4 space-y-3">
						{post.comments.map((comment) => (
							<div className="flex gap-3" key={comment.id}>
								<img
									alt={comment.user.name}
									className="w-8 h-8 rounded-full object-cover"
									src={
										comment.user.avatar ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=random`
									}
								/>
								<div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
									<h4 className="font-semibold text-sm text-gray-900 dark:text-white">
										{comment.user.name}
									</h4>
									<p className="text-sm text-gray-700 dark:text-gray-300">
										{comment.content}
									</p>
									<span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
										{formatDate(comment.dateCreated)}
									</span>
								</div>
							</div>
						))}
					</div>
					{/* Add Comment Input */}
					<div className="flex gap-3 mt-4">
						<img
							alt="Your avatar"
							className="w-8 h-8 rounded-full object-cover"
							src="https://ui-avatars.com/api/?name=You&background=random"
						/>
						<input
							className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Write a comment..."
							type="text"
						/>
					</div>
				</div>
			)}
		</article>
	)
}

export default PostCard
