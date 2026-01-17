import { useAuth } from "@/context/AuthContext"
import { Icon } from "@iconify/react"
import { NavLink } from "react-router-dom"

const SideBar = () => {
	const { user, logout } = useAuth()

	const navItems = [
		{
			icon: "flat-color-icons:home",
			label: "Feed",
			path: "/",
		},
		{
			icon: "solar:flag-bold",
			label: "Favorites",
            path: "/favorites",
            color: "#d21010",
		},
		{
			icon: "solar:users-group-rounded-bold-duotone",
			label: "Friends",
            path: "/friends",
            color: "#f0cb28",
		},
	]

	return (
		<aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:block overflow-y-auto">
			<nav className="p-4 space-y-2">
				{/* User Info */}
				{user && (
					<div className="mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
								{user.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-gray-900 dark:text-white truncate">
									{user.name}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
									@
									{user.name
										.toLowerCase()
										.replace(/\s+/g, "")}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Navigation Items */}
				{navItems.map((item) => (
					<NavLink
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
								isActive
									? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
							}`
						}
						key={item.path}
						to={item.path}
					>
						<Icon icon={item.icon} width="24" color={item.color || ""} />
						<span className="font-medium">{item.label}</span>
					</NavLink>
				))}

				{/* Divider */}
				<div className="my-4 border-t border-gray-200 dark:border-gray-700" />

				{/* Settings */}
				<NavLink
					className={({ isActive }) =>
						`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
							isActive
								? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
						}`
					}
					to="/settings"
				>
					<Icon icon="solar:settings-bold-duotone" width="24" />
					<span className="font-medium">Settings</span>
				</NavLink>

				{/* Footer */}
				<div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="px-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
						<div className="flex flex-wrap gap-2">
							<button
								className="hover:underline"
								onClick={() => {}}
								type="button"
							>
								About
							</button>
							<span>•</span>
							<button
								className="hover:underline"
								onClick={() => {}}
								type="button"
							>
								Help
							</button>
							<span>•</span>
							<button
								className="hover:underline"
								onClick={() => {}}
								type="button"
							>
								Privacy
							</button>
						</div>
						<p>© 2026 Social Media App</p>
					</div>
				</div>
			</nav>
		</aside>
	)
}

export default SideBar
