import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"

interface AddStoryModalProps {
	isOpen: boolean
	onClose: () => void
}

const AddStoryModal = ({ isOpen, onClose }: AddStoryModalProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [storyText, setStoryText] = useState("")
	const [textColor, setTextColor] = useState("#FFFFFF")
	const [backgroundColor, setBackgroundColor] = useState(
		"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)

	// Close modal on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		if (isOpen) {
			document.addEventListener("keydown", handleEscape)
			document.body.style.overflow = "hidden"
		}
		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.body.style.overflow = "unset"
		}
	}, [isOpen, onClose])

	// Close modal on backdrop click
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose()
		}
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile(file)
			const url = URL.createObjectURL(file)
			setPreviewUrl(url)
		}
	}

	const handleRemoveFile = () => {
		setSelectedFile(null)
		setPreviewUrl(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	const handleSubmit = () => {
		// TODO: Implement story upload logic
		console.log({
			file: selectedFile,
			text: storyText,
			textColor,
			backgroundColor,
		})
		onClose()
		// Reset form
		setSelectedFile(null)
		setPreviewUrl(null)
		setStoryText("")
	}

	if (!isOpen) return null

	const backgroundPresets = [
		"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
		"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
		"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
		"linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
		"linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
		"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
		"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
	]

	return (
		// biome-ignore lint/a11y/useSemanticElements: backdrop overlay needs div for positioning
		<div
			className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
			onKeyDown={(e) =>
				e.key === "Escape" &&
				handleBackdropClick(
					e as unknown as React.MouseEvent<HTMLDivElement>,
				)
			}
			role="button"
			tabIndex={0}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
				ref={modalRef}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						Create Story
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
				<div className="p-6 space-y-6">
					{/* Preview */}
					<div className="relative aspect-[9/16] max-h-[500px] rounded-xl overflow-hidden">
						{previewUrl ? (
							<img
								alt="Story preview"
								className="w-full h-full object-cover"
								src={previewUrl}
							/>
						) : (
							<div
								className="w-full h-full flex items-center justify-center"
								style={{ background: backgroundColor }}
							>
								<p
									className="text-2xl font-bold text-center px-8 max-w-md"
									style={{ color: textColor }}
								>
									{storyText || "Your story preview"}
								</p>
							</div>
						)}

						{/* Text overlay on image */}
						{previewUrl && storyText && (
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
								<p
									className="text-2xl font-bold text-center px-8 max-w-md"
									style={{ color: textColor }}
								>
									{storyText}
								</p>
							</div>
						)}

						{/* Remove image button */}
						{previewUrl && (
							<button
								className="absolute top-3 right-3 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
								onClick={handleRemoveFile}
								type="button"
							>
								<Icon
									icon="solar:trash-bin-trash-bold"
									width="20"
								/>
							</button>
						)}
					</div>

					{/* Upload Options */}
					<div className="space-y-4">
						{/* File Upload */}
						<div>
							<input
								accept="image/*,video/*"
								className="hidden"
								onChange={handleFileSelect}
								ref={fileInputRef}
								type="file"
							/>
							<button
								className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all"
								onClick={() => fileInputRef.current?.click()}
								type="button"
							>
								<Icon
									icon="solar:gallery-add-bold"
									width="24"
								/>
								{previewUrl
									? "Change Photo/Video"
									: "Add Photo/Video"}
							</button>
						</div>

						{/* Text Input */}
						<div>
							<label
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								htmlFor="story-text"
							>
								Add Text (Optional)
							</label>
							<textarea
								className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
								id="story-text"
								onChange={(e) => setStoryText(e.target.value)}
								placeholder="Add text to your story..."
								rows={3}
								value={storyText}
							/>
						</div>

						{/* Text Color Picker */}
						<div className="flex items-center gap-4">
							<label
								className="text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="text-color"
							>
								Text Color:
							</label>
							<input
								className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
								id="text-color"
								onChange={(e) => setTextColor(e.target.value)}
								type="color"
								value={textColor}
							/>
						</div>

						{/* Background Presets (only shown when no image) */}
						{!previewUrl && (
							<div>
								<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
									Background:
								</span>
								<div className="grid grid-cols-4 gap-3">
									{backgroundPresets.map((gradient) => (
										<button
											className={`w-full aspect-square rounded-lg transition-transform hover:scale-105 ${
												backgroundColor === gradient
													? "ring-4 ring-blue-500"
													: ""
											}`}
											key={gradient}
											onClick={() =>
												setBackgroundColor(gradient)
											}
											style={{ background: gradient }}
											type="button"
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
					<button
						className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						onClick={onClose}
						type="button"
					>
						Cancel
					</button>
					<button
						className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!previewUrl && !storyText}
						onClick={handleSubmit}
						type="button"
					>
						Share Story
					</button>
				</div>
			</div>
		</div>
	)
}

export default AddStoryModal
