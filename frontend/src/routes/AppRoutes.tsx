import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/Home"
import ProtectedRoutes from "./ProtectedRoutes"

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoutes />}>
					<Route element={<Home />} path="/" />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
