import { useAuth } from "@/context/AuthContext"
import { Outlet } from "react-router-dom"

export default function ProtectedRoutes() {
	const { user } = useAuth()
	console.log(user)

	// if (!user) {
	// 	return <Navigate replace to="/login" />
	// }

	return <Outlet />
}
