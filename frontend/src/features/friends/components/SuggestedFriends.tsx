import { Icon } from "@iconify/react"
import { useState } from "react"

interface SuggestedUser {
	id: number
	name: string
	username: string
	avatar: string
	mutualFriends: number
}

// Mock data - replace with actual API call
const mockSuggestedUsers: SuggestedUser[] = [
	{
		id: 4,
		name: "Sarah Wilson",
		username: "@sarahw",
		avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=F59E0B&color=fff",
		mutualFriends: 12,
	},
	{
		id: 5,
		name: "Michael Brown",
		username: "@mikeb",
		avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=8B5CF6&color=fff",
		mutualFriends: 8,
	},
	{
		id: 6,
		name: "Emily Davis",
		username: "@emilyd",
		avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=EF4444&color=fff",
		mutualFriends: 15,
	},
	{
		id: 7,
		name: "David Garcia",
		username: "@davidg",
		avatar: "https://ui-avatars.com/api/?name=David+Garcia&background=3B82F6&color=fff",
		mutualFriends: 5,
	},
	{
		id: 8,
		name: "Lisa Martinez",
		username: "@lisam",
		avatar: "https://ui-avatars.com/api/?name=Lisa+Martinez&background=EC4899&color=fff",
		mutualFriends: 20,
	},
]

const SuggestedFriends = () => {
	const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>(mockSuggestedUsers)
	const [followingIds, setFollowingIds] = useState<Set<number>>(new Set())

	const handleFollow = (userId: number) => {
		setFollowingIds((prev) => {
			const newSet = new Set(prev)
			newSet.add(userId)
			return newSet
		})
		// TODO: Call API to follow user
		console.log("Follow user:", userId)
	}

	const handleRemove = (userId: number) => {
		setSuggestedUsers((prev) => prev.filter((user) => user.id !== userId))
		// TODO: Call API to remove suggestion
		console.log("Remove suggestion:", userId)
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					Suggested for you
				</h2>
				<button
					className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
					type="button"
				>
					See all
				</button>
			</div>

			<div className="space-y-3">
				{suggestedUsers.length === 0 ? (
					<div className="text-center py-8">
						<Icon
							className="mx-auto text-gray-400 mb-2"
							icon="solar:users-group-rounded-bold-duotone"
							width="48"
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							No suggestions available
						</p>
					</div>
				) : (
					suggestedUsers.map((user) => (
						<div className="flex items-center gap-3" key={user.id}>
							<img
								alt={user.name}
								className="w-12 h-12 rounded-full object-cover flex-shrink-0"
								src={user.avatar}
							/>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
									{user.name}
								</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{user.username}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{user.mutualFriends} mutual friends
								</p>
							</div>
							<div className="flex items-center gap-2 flex-shrink-0">
								{followingIds.has(user.id) ? (
									<button
										className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
										type="button"
									>
										Following
									</button>
								) : (
									<>
										<button
											className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
											onClick={() => handleRemove(user.id)}
											type="button"
											title="Remove suggestion"
										>
											<Icon icon="solar:close-circle-bold" width="20" />
										</button>
										<button
											className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
											onClick={() => handleFollow(user.id)}
											type="button"
										>
											Follow
										</button>
									</>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default SuggestedFriends
