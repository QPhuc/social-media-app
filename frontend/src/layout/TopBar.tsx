import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

const TopBar = () => {
	const { user, logout } = useAuth()
	const theme = useTheme()

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
			<div className="flex items-center justify-between h-16 px-4 lg:px-6">
				{/* Logo & Search */}
				<div className="flex items-center gap-4 flex-1">
					<div className="flex items-center gap-2">
						<svg
							className="w-8 h-8 text-blue-500"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
						</svg>
						<h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
							Social
						</h1>
					</div>

					{/* Search Bar */}
					<div className="hidden md:flex items-center flex-1 max-w-md">
						<div className="relative w-full">
							<input
								type="text"
								placeholder="Search..."
								className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<svg
								className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Right Side - Actions */}
				<div className="flex items-center gap-3">
					{/* Theme Toggle */}
					<button
						onClick={theme?.toggleTheme}
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						aria-label="Toggle theme"
						type="button"
					>
						{theme?.darkMode ? (
							<svg
								className="w-5 h-5 text-gray-700 dark:text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
							</svg>
						) : (
							<svg
								className="w-5 h-5 text-gray-700 dark:text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						)}
					</button>

					{/* Notifications */}
					<button
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						aria-label="Notifications"
						type="button"
					>
						<svg
							className="w-5 h-5 text-gray-700 dark:text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
					</button>

					{/* Messages */}
					<button
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						aria-label="Messages"
						type="button"
					>
						<svg
							className="w-5 h-5 text-gray-700 dark:text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
					</button>

					{/* User Menu */}
					<div className="relative">
						<button
							className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							type="button"
						>
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
								{user?.name?.charAt(0).toUpperCase() || "U"}
							</div>
							<svg
								className="w-4 h-4 text-gray-700 dark:text-gray-300 hidden sm:block"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label="Menu"
						type="button"
					>
						<svg
							className="w-6 h-6 text-gray-700 dark:text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</header>
	)
}

export default TopBar
