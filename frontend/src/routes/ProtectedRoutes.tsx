import { useAuth } from "@/context/AuthContext"
import { Outlet } from "react-router-dom"

export default function ProtectedRoutes() {
	const { user } = useAuth()

	// if (!user) {
	// 	return <Navigate replace to="/login" />
	// }

	return <Outlet />
}
