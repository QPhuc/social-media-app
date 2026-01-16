import SideBar from "./SideBar"
import TopBar from "./TopBar"

const PageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<TopBar />
			<SideBar />

			{/* Main Content */}
			<main className="pt-16 lg:pl-64">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					{children}
				</div>
			</main>
		</div>
	)
}

export default PageContainer
