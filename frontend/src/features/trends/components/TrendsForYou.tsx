import { Icon } from "@iconify/react"

interface Trend {
	id: number
	category: string
	hashtag: string
	posts: number
}

// Mock data - replace with actual API call
const mockTrends: Trend[] = [
	{
		id: 1,
		category: "Technology",
		hashtag: "#ReactJS",
		posts: 125400,
	},
	{
		id: 2,
		category: "Entertainment",
		hashtag: "#Movies2026",
		posts: 89300,
	}
]

const TrendsForYou = () => {
	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`
		}
		return num.toString()
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					Trends for you
				</h2>
				<button
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
					type="button"
					title="Settings"
				>
					<Icon icon="solar:settings-bold-duotone" width="20" />
				</button>
			</div>

			<div className="space-y-1">
				{mockTrends.map((trend) => (
					<button
						className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
						key={trend.id}
						type="button"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{trend.category}
								</p>
								<h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mt-0.5">
									{trend.hashtag}
								</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
									{formatNumber(trend.posts)} posts
								</p>
							</div>
							<button
								className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-opacity"
								onClick={(e) => {
									e.stopPropagation()
									// TODO: Implement show less option
									console.log("Show less:", trend.hashtag)
								}}
								type="button"
								title="Not interested"
							>
								<Icon icon="solar:menu-dots-bold" width="20" />
							</button>
						</div>
					</button>
				))}
			</div>

			<button
				className="w-full mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
				type="button"
			>
				Show more
			</button>
		</div>
	)
}

export default TrendsForYou
