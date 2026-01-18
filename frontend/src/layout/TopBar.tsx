import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

const TopBar = () => {
	const { user, logout } = useAuth()
	const theme = useTheme()
	const [showUserMenu, setShowUserMenu] = useState(false)
	const userMenuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setShowUserMenu(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
			<div className="flex items-center justify-between h-16 px-4 lg:px-6">
				{/* Logo & Search */}
				<div className="flex items-center gap-4 flex-1">
					<div className="flex items-center gap-2">
						<Icon icon="solar:chat-round-bold-duotone" width="32" />
						<h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
							Social
						</h1>
					</div>

					{/* Search Bar */}
					<div className="hidden md:flex items-center flex-1 max-w-md">
						<div className="relative w-full">
							<input
								className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Search..."
								type="text"
							/>
							<Icon
								className="absolute left-3 top-2.5 text-gray-500"
								icon="solar:magnifer-linear"
								width="20"
							/>
						</div>
					</div>
				</div>

				{/* Right Side - Actions */}
				<div className="flex items-center gap-3">
					{/* Theme Toggle */}
					<button
						aria-label="Toggle theme"
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={theme?.toggleTheme}
						type="button"
					>
						{theme?.darkMode ? (
							<Icon
								className="text-gray-700 dark:text-gray-300"
								icon="solar:sun-bold-duotone"
								width="20"
							/>
						) : (
							<Icon
								className="text-gray-700 dark:text-gray-300"
								icon="solar:moon-bold-duotone"
								width="20"
							/>
						)}
					</button>

					{/* Notifications */}
					<button
						aria-label="Notifications"
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						type="button"
					>
						<Icon
							className="text-gray-700 dark:text-gray-300"
							icon="solar:bell-bold-duotone"
							width="20"
						/>
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
					</button>

					{/* Messages */}
					<button
						aria-label="Messages"
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						type="button"
					>
						<Icon
							className="text-gray-700 dark:text-gray-300"
							icon="solar:chat-round-dots-bold-duotone"
							width="20"
						/>
						<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
					</button>

					{/* User Menu */}
					<div className="relative" ref={userMenuRef}>
						<button
							className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							onClick={() => setShowUserMenu(!showUserMenu)}
							type="button"
						>
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
								{user?.name?.charAt(0).toUpperCase() || "U"}
							</div>
							<Icon
								className="text-gray-700 dark:text-gray-300 hidden sm:block"
								icon="solar:alt-arrow-down-linear"
								width="16"
							/>
						</button>

						{/* Dropdown Menu */}
						{showUserMenu && (
							<div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
								{/* User Info */}
								<div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
											{user?.name
												?.charAt(0)
												.toUpperCase() || "U"}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-gray-900 dark:text-white truncate">
												{user?.name || "User"}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
												{user?.email ||
													"user@example.com"}
											</p>
										</div>
									</div>
								</div>

								{/* Menu Items */}
								<div className="py-2">
									<button
										className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
										onClick={() => {
											setShowUserMenu(false)
											// Navigate to profile
										}}
										type="button"
									>
										<Icon
											icon="solar:user-bold-duotone"
											width="20"
										/>
										<span>Profile</span>
									</button>

									<button
										className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
										onClick={() => {
											setShowUserMenu(false)
											// Navigate to settings
										}}
										type="button"
									>
										<Icon
											icon="solar:settings-bold-duotone"
											width="20"
										/>
										<span>Settings</span>
									</button>
								</div>

								{/* Logout */}
								<div className="border-t border-gray-200 dark:border-gray-700 pt-2">
									<button
										className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
										onClick={() => {
											setShowUserMenu(false)
											logout()
										}}
										type="button"
									>
										<Icon
											icon="solar:logout-2-bold-duotone"
											width="20"
										/>
										<span>Logout</span>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Mobile Menu Toggle */}
					<button
						aria-label="Menu"
						className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
						type="button"
					>
						<Icon
							className="text-gray-700 dark:text-gray-300"
							icon="solar:hamburger-menu-linear"
							width="24"
						/>
					</button>
				</div>
			</div>
		</header>
	)
}

export default TopBar
