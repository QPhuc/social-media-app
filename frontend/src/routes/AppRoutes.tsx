import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageContainer from "@/layout/PageContainer"
import CreateStory from "@/pages/CreateStory"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import ProtectedRoutes from "./ProtectedRoutes"

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes - No Layout */}
				<Route element={<Login />} path="/login" />
				<Route element={<NotFound />} path="/404" />

				{/* Protected Routes - With Layout */}
				<Route element={<ProtectedRoutes />}>
					<Route
						element={
							<PageContainer>
								<Home />
							</PageContainer>
						}
						path="/"
					/>
					{/* Story Creation - Full Screen (No Layout) */}
					<Route element={<CreateStory />} path="/stories/create" />
				</Route>

				{/* Catch all - redirect to 404 */}
				<Route element={<NotFound />} path="*" />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
