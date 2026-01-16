import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoutes() {
	const { user } = useAuth()
	console.log(user)

	// if (!user) {
	// 	return <Navigate replace to="/login" />
	// }

	return <Outlet />
}
