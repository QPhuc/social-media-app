import BellIcon from "@/assets/icons/bell.svg?react"
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react"
import LogoIcon from "@/assets/icons/logo.svg?react"
import MenuIcon from "@/assets/icons/menu.svg?react"
import MessageIcon from "@/assets/icons/message.svg?react"
import MoonIcon from "@/assets/icons/moon.svg?react"
import SearchIcon from "@/assets/icons/search.svg?react"
import SunIcon from "@/assets/icons/sun.svg?react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

const TopBar = () => {
	const { user } = useAuth()
	const theme = useTheme()

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
			<div className="flex items-center justify-between h-16 px-4 lg:px-6">
				{/* Logo & Search */}
				<div className="flex items-center gap-4 flex-1">
					<div className="flex items-center gap-2">
						<LogoIcon className="w-8 h-8 text-blue-500" />
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
							<SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
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
							<SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						) : (
							<MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						)}
					</button>

					{/* Notifications */}
					<button
						aria-label="Notifications"
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						type="button"
					>
						<BellIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
					</button>

					{/* Messages */}
					<button
						aria-label="Messages"
						className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
						type="button"
					>
						<MessageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
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
							<ChevronDownIcon className="w-4 h-4 text-gray-700 dark:text-gray-300 hidden sm:block" />
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						aria-label="Menu"
						className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
						type="button"
					>
						<MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
					</button>
				</div>
			</div>
		</header>
	)
}

export default TopBar
