import { Icon } from "@iconify/react"
import { useRef, useState } from "react"

interface CreatePostModalProps {
	isOpen: boolean
	onClose: () => void
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
	const [postContent, setPostContent] = useState("")
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	if (!isOpen) return null

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setSelectedImage(url)
		}
	}

	const handlePost = () => {
		// TODO: Implement post creation logic
		console.log({ content: postContent, image: selectedImage })
		setPostContent("")
		setSelectedImage(null)
		onClose()
	}

	return (
		// biome-ignore lint/a11y/useSemanticElements: backdrop overlay needs div for positioning
		<div
			className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
			onKeyDown={(e) => e.key === "Escape" && onClose()}
			role="button"
			tabIndex={0}
		>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						Create post
					</h2>
					<button
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
						onClick={onClose}
						type="button"
					>
						<Icon icon="solar:close-circle-bold" width="28" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					{/* User Info */}
					<div className="flex items-center gap-3">
						<img
							alt="Your avatar"
							className="w-12 h-12 rounded-full object-cover"
							src="https://ui-avatars.com/api/?name=You&background=random"
						/>
						<div>
							<p className="font-semibold text-gray-900 dark:text-white">
								You
							</p>
							<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
								<Icon icon="solar:users-group-rounded-bold" width="16" />
								<span>Public</span>
							</div>
						</div>
					</div>

					{/* Text Area */}
					<textarea
						className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none text-lg"
						onChange={(e) => setPostContent(e.target.value)}
						placeholder="What's on your mind?"
						rows={6}
						value={postContent}
					/>

					{/* Image Preview */}
					{selectedImage && (
						<div className="relative rounded-xl overflow-hidden">
							<img
								alt="Selected"
								className="w-full max-h-96 object-cover"
								src={selectedImage}
							/>
							<button
								className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								onClick={() => setSelectedImage(null)}
								type="button"
							>
								<Icon icon="solar:trash-bin-trash-bold" width="20" />
							</button>
						</div>
					)}

					{/* Add to Post */}
					<div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-gray-900 dark:text-white">
								Add to your post
							</span>
							<div className="flex items-center gap-2">
								<input
									accept="image/*"
									className="hidden"
									onChange={handleImageSelect}
									ref={fileInputRef}
									type="file"
								/>
								<button
									className="p-2 text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
									onClick={() => fileInputRef.current?.click()}
									title="Add photo/video"
									type="button"
								>
									<Icon icon="solar:gallery-bold-duotone" width="24" />
								</button>
								<button
									className="p-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
									title="Tag people"
									type="button"
								>
									<Icon
										icon="solar:users-group-rounded-bold-duotone"
										width="24"
									/>
								</button>
								<button
									className="p-2 text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
									title="Add emoji"
									type="button"
								>
									<Icon
										icon="solar:emoji-funny-square-bold-duotone"
										width="24"
									/>
								</button>
								<button
									className="p-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
									title="Add location"
									type="button"
								>
									<Icon icon="solar:map-point-bold-duotone" width="24" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
					<button
						className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
						disabled={!postContent.trim() && !selectedImage}
						onClick={handlePost}
						type="button"
					>
						Post
					</button>
				</div>
			</div>
		</div>
	)
}

export default CreatePostModal
