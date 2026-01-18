import { Icon } from "@iconify/react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

type StoryMode = "text" | "photo"

const CreateStory = () => {
	const navigate = useNavigate()
	const [mode, setMode] = useState<StoryMode>("text")
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [storyText, setStoryText] = useState("")
	const [textColor, setTextColor] = useState("#FFFFFF")
	const [fontSize, setFontSize] = useState(32)
	const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
		"center",
	)
	const [backgroundColor, setBackgroundColor] = useState("#667eea")
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile(file)
			const url = URL.createObjectURL(file)
			setPreviewUrl(url)
			setMode("photo")
		}
	}

	const handleShare = () => {
		// TODO: Implement story upload logic
		console.log({
			mode,
			file: selectedFile,
			text: storyText,
			textColor,
			fontSize,
			textAlign,
			backgroundColor,
		})
		navigate("/")
	}

	const backgroundColors = [
		{ name: "Purple", value: "#667eea" },
		{ name: "Pink", value: "#f093fb" },
		{ name: "Blue", value: "#4facfe" },
		{ name: "Green", value: "#43e97b" },
		{ name: "Orange", value: "#fa709a" },
		{ name: "Red", value: "#f5576c" },
		{ name: "Teal", value: "#38f9d7" },
		{ name: "Yellow", value: "#fee140" },
		{ name: "Indigo", value: "#330867" },
		{ name: "Cyan", value: "#00f2fe" },
	]

	const fontSizes = [
		{ label: "Small", value: 24 },
		{ label: "Normal", value: 32 },
		{ label: "Large", value: 40 },
		{ label: "Extra Large", value: 48 },
	]

	return (
		<div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 overflow-hidden flex flex-col">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
				<div className="flex items-center justify-between max-w-screen-2xl mx-auto">
					<div className="flex items-center gap-2 md:gap-4">
						<button
							className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
							onClick={() => navigate("/")}
							type="button"
						>
							<Icon
								className="md:w-8 md:h-8"
								icon="solar:close-circle-bold"
								width="28"
							/>
						</button>
						<div>
							<h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
								Your story
							</h1>
							<p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
								Share a photo or write something
							</p>
						</div>
					</div>
					<button
						className="px-3 py-2 md:px-6 md:py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={mode === "text" ? !storyText : !selectedFile}
						onClick={handleShare}
						type="button"
					>
						Share
					</button>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full">
				{/* Left Sidebar */}
				<div className="w-full lg:w-72 xl:w-80 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto flex-shrink-0">
					<h2 className="font-semibold text-gray-900 dark:text-white mb-4 hidden lg:block">
						Create a story
					</h2>

					{/* Mode Selection */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-6">
						<button
							className={`w-full flex items-center gap-3 p-3 lg:p-4 rounded-lg transition-colors ${
								mode === "text"
									? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
									: "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
							}`}
							onClick={() => setMode("text")}
							type="button"
						>
							<div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
								<Icon
									className="text-white"
									icon="solar:text-bold"
									width="20"
								/>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white">
									Create a text story
								</h3>
								<p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
									Share text with a colorful background
								</p>
							</div>
						</button>

						<button
							className={`w-full flex items-center gap-3 p-3 lg:p-4 rounded-lg transition-colors ${
								mode === "photo"
									? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
									: "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
							}`}
							onClick={() => {
								setMode("photo")
								fileInputRef.current?.click()
							}}
							type="button"
						>
							<div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
								<Icon
									className="text-white"
									icon="solar:gallery-bold"
									width="20"
								/>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white">
									Create a photo story
								</h3>
								<p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
									Share a photo or video
								</p>
							</div>
						</button>
					</div>

					<input
						accept="image/*,video/*"
						className="hidden"
						onChange={handleFileSelect}
						ref={fileInputRef}
						type="file"
					/>

					{/* Text Story Options */}
					{mode === "text" && (
						<div className="space-y-4">
							<div>
								<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Background Color
								</span>
								<div className="grid grid-cols-5 gap-2">
									{backgroundColors.map((color) => (
										<button
											className={`w-full aspect-square rounded-lg transition-all ${
												backgroundColor === color.value
													? "ring-4 ring-blue-500 scale-110"
													: "hover:scale-105"
											}`}
											key={color.value}
											onClick={() =>
												setBackgroundColor(color.value)
											}
											style={{
												backgroundColor: color.value,
											}}
											title={color.name}
											type="button"
										/>
									))}
								</div>
							</div>

							<div>
								<label
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									htmlFor="text-size-select"
								>
									Text Size
								</label>
								<select
									className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
									id="text-size-select"
									onChange={(e) =>
										setFontSize(Number(e.target.value))
									}
									value={fontSize}
								>
									{fontSizes.map((size) => (
										<option
											key={size.value}
											value={size.value}
										>
											{size.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Text Alignment
								</span>
								<div className="flex gap-2">
									{(
										[
											{ align: "left", icon: "left" },
											{
												align: "center",
												icon: "horizontal-center",
											},
											{ align: "right", icon: "right" },
										] as const
									).map(({ align, icon }) => (
										<button
											className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
												textAlign === align
													? "bg-blue-500 text-white"
													: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
											}`}
											key={align}
											onClick={() => setTextAlign(align)}
											type="button"
										>
											<Icon
												className="mx-auto"
												icon={`solar:align-${icon}-bold-duotone`}
												width="20"
											/>
										</button>
									))}
								</div>
							</div>

							<div>
								<label
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									htmlFor="text-color-input"
								>
									Text Color
								</label>
								<div className="flex items-center gap-3">
									<input
										className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
										id="text-color-input"
										onChange={(e) =>
											setTextColor(e.target.value)
										}
										type="color"
										value={textColor}
									/>
									<span className="text-sm text-gray-600 dark:text-gray-400 uppercase font-mono">
										{textColor}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Photo Story Options */}
					{mode === "photo" && previewUrl && (
						<div className="space-y-4">
							<button
								className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
								onClick={() => fileInputRef.current?.click()}
								type="button"
							>
								<Icon
									icon="solar:gallery-add-bold"
									width="20"
								/>
								Change Photo/Video
							</button>

							<button
								className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium py-3 px-4 rounded-lg transition-colors"
								onClick={() => {
									setPreviewUrl(null)
									setSelectedFile(null)
									setMode("text")
								}}
								type="button"
							>
								<Icon
									icon="solar:trash-bin-trash-bold"
									width="20"
								/>
								Remove Photo
							</button>

							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Add text overlay
								</span>
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
									Add text to appear on your photo
								</p>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<input
											className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
											onChange={(e) =>
												setTextColor(e.target.value)
											}
											type="color"
											value={textColor}
										/>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											Text Color
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Center Preview */}
				<div className="flex-1 flex items-center justify-center m-4 overflow-y-auto">
					<div className="w-full h-full bg-gray-50 dark:bg-gray-900 max-w-2xl my-auto rounded-xl">
						<h3 className="text-lg font-semibold pt-4 px-4 text-gray-900 dark:text-white">
							Preview
						</h3>
						<div
							className="bg-white dark:bg-gray-800 rounded-2xl m-4 shadow-lg border-2 border-gray-200 dark:border-gray-700"
							style={{ height: "calc(100% - 80px)" }}
						>
							<div
								className="relative w-full h-full max-w-[320px] sm:max-w-sm md:max-w-md mx-auto aspect-[9/16] rounded-xl overflow-hidden shadow-xl border-2 border-gray-300 dark:border-gray-600 top-4"
								style={{ height: "calc(100% - 64px)" }}
							>
								{mode === "text" || !previewUrl ? (
									<div
										className="w-full h-full flex items-center justify-center p-6 md:p-8"
										style={{ backgroundColor }}
									>
										<textarea
											className="w-full max-h-[40%] bg-transparent resize-none outline-none placeholder-white/50 font-medium text-center"
											onChange={(e) =>
												setStoryText(e.target.value)
											}
											placeholder="Start typing..."
											style={{
												color: textColor,
												fontSize: `${fontSize}px`,
												textAlign,
											}}
											value={storyText}
										/>
									</div>
								) : (
									<div className="relative w-full h-full">
										<img
											alt="Story preview"
											className="w-full h-full object-cover"
											src={previewUrl}
										/>
										{!storyText && (
											<div className="absolute bottom-0 left-0 right-0 p-4">
												<input
													className="w-full bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-3 outline-none placeholder-white/70 border border-white/20"
													onChange={(e) =>
														setStoryText(
															e.target.value,
														)
													}
													placeholder="Add text to your photo..."
													type="text"
													value={storyText}
												/>
											</div>
										)}
										{storyText && (
											<div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
												<textarea
													className="w-full max-h-full bg-transparent resize-none outline-none placeholder-white/70 font-bold text-shadow-lg"
													onChange={(e) =>
														setStoryText(
															e.target.value,
														)
													}
													placeholder="Add text to your photo..."
													style={{
														color: textColor,
														fontSize: `${fontSize}px`,
														textAlign,
														textShadow:
															"0 2px 4px rgba(0,0,0,0.5)",
													}}
													value={storyText}
												/>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateStory
