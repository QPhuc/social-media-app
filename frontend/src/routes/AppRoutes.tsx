import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import ProtectedRoutes from "./ProtectedRoutes"

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<ProtectedRoutes />}>
					<Route element={<Home />} path="/" />
					<Route element={<Login />} path="/login" />
				</Route>

				<Route element={<NotFound />} path="*" />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
